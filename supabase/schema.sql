-- Lavacarros independientes registrados
create table lavacarros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  descripcion text,
  base_lat double precision not null,
  base_lng double precision not null,
  radio_km numeric not null default 5,
  estado text not null default 'pendiente', -- pendiente | aprobado | rechazado
  creado_en timestamp with time zone default now()
);

-- Clientes que usan la app (para poder calificar)
create table clientes (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid references auth.users(id),
  nombre text,
  creado_en timestamp with time zone default now()
);

-- Calificaciones: solo quien confirmó "ya lo usé"
create table calificaciones (
  id uuid primary key default gen_random_uuid(),
  lavacarros_id uuid references lavacarros(id) on delete cascade,
  cliente_id uuid references clientes(id),
  estrellas int not null check (estrellas between 1 and 5),
  comentario text,
  confirmado_uso boolean not null default false,
  creado_en timestamp with time zone default now()
);

-- Habilitar acceso público de lectura solo a lavacarros aprobados
alter table lavacarros enable row level security;
create policy "Lectura publica de aprobados"
  on lavacarros for select
  using (estado = 'aprobado');

create policy "Cualquiera puede registrarse"
  on lavacarros for insert
  with check (true);

alter table calificaciones enable row level security;
create policy "Lectura publica de calificaciones"
  on calificaciones for select
  using (true);
