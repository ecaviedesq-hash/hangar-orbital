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
