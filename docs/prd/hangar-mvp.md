# Hangar Orbital — mini-PRD

## 1. Problema

Los jefes de hangar deciden de memoria qué nave despega. El mes pasado una nave salió con el tanque casi vacío y otra encadenó seis misiones sin pasar por revisión.

## 2. Usuarios

De 3 a 5 jefes de hangar. Todos tienen el mismo permiso.

## 3. Objetivo y métrica de éxito

Que un jefe sepa, en cualquier momento, qué naves pueden despegar. Éxito: en un mes, cero despegues de naves no aptas.

## 4. Alcance del MVP

- Registrar las naves del hangar.
- Asignar misiones a una nave.
- Consultar qué naves están aptas para despegar.
- Anotar el combustible, las revisiones y el dique seco.

## 5. No-alcance

Quedan fuera la tripulación, los usuarios y el inicio de sesión, las notificaciones, los mapas y las trayectorias, el cálculo automático del consumo de combustible y la aplicación móvil.

## 6. Reglas de negocio

- El combustible es un porcentaje entero de 0 a 100. Con exactamente 25 % la nave cumple la condición de combustible; por debajo de 25 % no está apta.
- Una nave está apta para despegar si tiene al menos 25 % de combustible y no tiene más de 3 misiones asignadas desde su última revisión.
- Una nave admite como máximo 3 misiones entre revisiones: si ya tiene 3, no recibe otra hasta su próxima revisión.
- Cuentan todas las misiones asignadas desde la última revisión, ya realizadas o programadas.
- Una nave recién registrada cuenta como revisada en su fecha de registro.
- Asignar una misión no cambia el combustible: se actualiza a mano.
- Una nave en dique seco no puede recibir misiones mientras esté así.

## 7. Supuestos

- [SUPUESTO] Cualquier jefe ve y actualiza la misma información del hangar.
- [SUPUESTO] Un jefe puede registrar una nueva revisión; desde esa fecha solo cuentan las misiones asignadas después.
- [SUPUESTO] Un jefe puede indicar que la nave salió del dique seco y vuelve a poder recibir misiones.
- [SUPUESTO] Consultar la aptitud informa al jefe; no sustituye la orden de despegue ni calcula el consumo.

## 8. Puntos abiertos

- No está decidido si una nave en dique seco deja de estar apta para despegar o solo se le impide recibir misiones nuevas.
- No está decidido qué ocurre con las misiones ya asignadas cuando la nave entra en dique seco.
- No está decidido si una nave puede tener dos misiones con fechas superpuestas.
