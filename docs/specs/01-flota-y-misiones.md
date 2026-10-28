# Spec 01 · Flota y misiones

Historias del sprint: HU-1.1 y HU-1.3. Los componentes no llaman a Supabase; solo los servicios de `src/services/`. En TypeScript los nombres van en camelCase y en la base de datos en snake_case. No se usa `any`. En el cliente solo entra la clave pública (anon).

## 1. Base de datos

Migración: `supabase/migraciones/001_hangar.sql`.

```sql
create table public.naves (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  clase text not null check (clase in ('exploradora', 'carguera', 'transporte')),
  combustible integer not null check (combustible >= 0 and combustible <= 100),
  en_reparacion boolean not null default false,
  ultima_revision timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.misiones (
  id uuid primary key default gen_random_uuid(),
  nave_id uuid not null references public.naves (id),
  destino text not null,
  fecha_despegue date not null,
  duracion_dias integer not null check (duracion_dias >= 1),
  created_at timestamptz not null default now()
);

alter table public.naves enable row level security;
alter table public.misiones enable row level security;

create policy naves_anon_select
  on public.naves for select to anon using (true);

create policy naves_anon_insert
  on public.naves for insert to anon with check (true);

create policy misiones_anon_select
  on public.misiones for select to anon using (true);

create policy misiones_anon_insert
  on public.misiones for insert to anon with check (true);
```

Es temporal porque el MVP no tiene inicio de sesión y el navegador usa la clave pública; cuando haya usuarios, estas políticas se sustituyen. No hay políticas de actualizar ni de borrar.

## 2. Tipos

`src/types/nave.ts` y `src/types/mision.ts`.

```ts
export type ClaseNave = "exploradora" | "carguera" | "transporte";

export type Nave = {
  id: string;
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: boolean;
  ultimaRevision: string;
  createdAt: string;
};

export type NaveNueva = {
  nombre: string;
  clase: ClaseNave;
  combustible: number;
  enReparacion: false;
  ultimaRevision: string;
};

export type Mision = {
  id: string;
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
  createdAt: string;
};

export type MisionNueva = {
  naveId: string;
  destino: string;
  fechaDespegue: string;
  duracionDias: number;
};
```

## 3. Dominio

Funciones puras, sin Supabase. Los motivos son los mismos textos que ve el jefe.

### validarNave

`src/dominio/validarNave.ts`

Recibe el nombre, la clase, el combustible, los nombres ya registrados y la fecha de registro. Devuelve la nave lista para guardar o la lista de motivos.

- Nombre vacío: «Falta el nombre.»
- Clase vacía: «Falta la clase.»
- Combustible ausente: «Falta el combustible.»
- Nombre ya registrado, sin distinguir mayúsculas: «Ya existe una nave con ese nombre.»
- Clase distinta de exploradora, carguera o transporte: «La clase debe ser exploradora, carguera o transporte.»
- Combustible que no sea un entero de 0 a 100: «El combustible debe ser un entero entre 0 y 100.»
- Si pasa, `enReparacion` es false y `ultimaRevision` es la fecha de registro. Un combustible de 25, o menor, no impide registrarla.

### validarMision

`src/dominio/validarMision.ts`

Recibe la misión y la fecha de hoy (`AAAA-MM-DD`). No mira combustible, reparación ni cuántas misiones lleva la nave.

- Sin nave: «Falta la nave.»
- Destino vacío: «Falta el destino.»
- Sin fecha: «Falta la fecha de despegue.»
- Sin duración: «Falta la duración.»
- Fecha anterior a hoy: «La fecha de despegue no puede ser anterior a hoy.» Hoy sí vale.
- Duración que no sea un entero mayor o igual que 1: «La duración debe ser un número entero de días, como mínimo 1.»

### puedeRecibirMision

`src/dominio/puedeRecibirMision.ts`

Recibe la nave y cuántas misiones tiene desde su última revisión. Devuelve si puede y, si no, un solo motivo. No modifica el combustible. El orden de los rechazos es este:

1. Nave en reparación: «La nave está en reparación y no puede recibir misiones.»
2. Poco combustible, por debajo de 25: «La nave no tiene combustible suficiente (hace falta al menos 25 %).» Con 25 % este rechazo no aplica.
3. Ya tiene 3 misiones desde la revisión: «La nave ya tiene 3 misiones desde su última revisión.» Con menos de 3, este rechazo no aplica.

## 4. Servicios

`src/lib/supabase.ts` crea el cliente con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Esas variables no se escriben en el código.

### navesService

`src/services/navesService.ts`

- `crear`: llama a `validarNave`. Si no pasa, no inserta y devuelve los motivos. Si pasa, inserta en `naves` (`nombre`, `clase`, `combustible`, `en_reparacion`, `ultima_revision`) y devuelve la nave.
- `listar`: lee `naves` y las devuelve en camelCase.

### misionesService

`src/services/misionesService.ts`

- `contarDesdeRevision`: cuenta filas de `misiones` de esa nave con `created_at` mayor o igual que `ultima_revision`.
- `crear`: valida la misión con la fecha de hoy, cuenta las misiones desde la revisión y llama a `puedeRecibirMision`. Solo inserta si las dos dejan pasar. No actualiza el combustible.

## 5. Componentes

- `FormularioNave`: nombre, clase y combustible. Al guardar, llama a `navesService.crear` y muestra los motivos.
- `ListaNaves`: muestra lo que devuelve `navesService.listar`, incluido el combustible.
- `FormularioMision`: nave ya registrada, destino, fecha de despegue y duración. Llama a `misionesService.crear` y muestra el motivo. No ofrece naves que todavía no están en el hangar.

## 6. Criterios con DEBE y NO DEBE

### HU-1.1

- CA-1.1.1. Con nombre, clase y combustible válidos, la nave DEBE aparecer y DEBE contar como revisada en la fecha de registro.
- CA-1.1.2. Si falta el nombre, la clase o el combustible, la nave NO DEBE aparecer y el jefe DEBE ver qué falta.
- CA-1.1.3. Si el nombre ya existe, la nave NO DEBE aparecer y el jefe DEBE ver que está repetido.
- CA-1.1.4. Si la clase no es exploradora, carguera o transporte, la nave NO DEBE aparecer y el jefe DEBE ver que la clase no vale.
- CA-1.1.5. Si el combustible no es un entero de 0 a 100, la nave NO DEBE aparecer y el jefe DEBE ver que el combustible no vale.
- CA-1.1.6. Con combustible 25, o menor, y el resto válido, la nave DEBE aparecer. Con 25 cumple la condición de combustible. Con menos queda registrada aunque no esté apta para despegar.

### HU-1.3

- CA-1.3.1. Con nave, destino, fecha y duración válidos, y la nave pudiendo recibir trabajo, la misión DEBE quedar en esa nave y el combustible NO DEBE cambiar.
- CA-1.3.2. Si falta la nave, el destino, la fecha o la duración, la misión NO DEBE aparecer y el jefe DEBE ver qué falta.
- CA-1.3.3. Si la fecha es anterior a hoy, la misión NO DEBE aparecer y el jefe DEBE ver que la fecha no vale.
- CA-1.3.4. Si la fecha es hoy y el resto es válido, la misión DEBE aparecer.
- CA-1.3.5. Si la duración no es un entero de 1 o más, la misión NO DEBE aparecer y el jefe DEBE ver que la duración no vale.
- CA-1.3.6. Si la nave está en reparación, la misión NO DEBE aparecer y el jefe DEBE ver que está en reparación.
- CA-1.3.7. Si ya tiene 3 misiones desde la última revisión, contando hechas y programadas, la misión NO DEBE aparecer y el jefe DEBE ver que llegó al máximo.
- CA-1.3.8. Si tiene menos de 3 misiones desde la revisión y los datos son válidos, la misión DEBE aparecer.
- CA-1.3.9. Punto abierto: dos misiones con fechas superpuestas. Este sprint NO DEBE aceptarlas ni rechazarlas por ese motivo.
- CA-1.3.10. Si el combustible es menor que 25, la misión NO DEBE aparecer y el jefe DEBE ver que no alcanza. Con exactamente 25, y el resto válido, la misión DEBE aparecer.

## 7. Criterio → verificación

| Criterio | Verificación |
| --- | --- |
| CA-1.1.1 | Vitest de `validarNave` (queda revisada en la fecha de registro) y prueba manual: la nave se ve en el navegador |
| CA-1.1.2 | Vitest de `validarNave` y prueba manual del mensaje |
| CA-1.1.3 | Vitest de `validarNave` con nombres ya registrados y prueba manual |
| CA-1.1.4 | Vitest de `validarNave` |
| CA-1.1.5 | Vitest de `validarNave` |
| CA-1.1.6 | Vitest de `validarNave`: acepta 25 y un valor menor |
| CA-1.3.1 | Vitest de `puedeRecibirMision` (no cambia el combustible) y prueba manual |
| CA-1.3.2 | Vitest de `validarMision` |
| CA-1.3.3 | Vitest de `validarMision` con la fecha de hoy como parámetro |
| CA-1.3.4 | Vitest de `validarMision` con fecha igual a hoy |
| CA-1.3.5 | Vitest de `validarMision` |
| CA-1.3.6 | Vitest de `puedeRecibirMision` con la nave en reparación |
| CA-1.3.7 | Vitest de `puedeRecibirMision` con 3 misiones desde la revisión |
| CA-1.3.8 | Vitest de `puedeRecibirMision` con menos de 3 |
| CA-1.3.9 | Sin prueba de comportamiento: no hay regla de solape |
| CA-1.3.10 | Vitest de `puedeRecibirMision` con combustible menor que 25 y con exactamente 25 |

Los tests de Vitest no usan base de datos.

## 8. Ticket → archivos

| Ticket | Archivos |
| --- | --- |
| T-01 | `package.json`, `.env.example`, `src/lib/supabase.ts`, `vite.config.ts`, `supabase/migraciones/001_hangar.sql` |
| T-02 | `src/types/nave.ts`, `src/dominio/validarNave.ts` |
| T-03 | `src/dominio/validarNave.test.ts` |
| T-04 | `src/services/navesService.ts`, `src/components/FormularioNave.tsx`, `src/components/ListaNaves.tsx`, `src/App.tsx` |
| T-05 | `src/types/mision.ts`, `src/dominio/validarMision.ts`, `src/dominio/puedeRecibirMision.ts` |
| T-06 | `src/dominio/validarMision.test.ts`, `src/dominio/puedeRecibirMision.test.ts` |
| T-07 | `src/services/misionesService.ts`, `src/components/FormularioMision.tsx`, `src/App.tsx` |
