create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp_number text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_config (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.zap_items (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  content text not null default '',
  type text not null default 'nota',
  category text not null default 'sem-categoria',
  priority text not null default 'media',
  status text not null default 'entrada',
  tags jsonb not null default '[]'::jsonb,
  origin text not null default 'Manual',
  remote_jid text,
  important boolean not null default false,
  seen boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  reminder_at timestamptz,
  archived_at timestamptz,
  completed_at timestamptz,
  summary text,
  url text,
  preview_url text,
  preview jsonb,
  user_id uuid references public.users(id) on delete set null
);

create index if not exists zap_items_user_id_idx on public.zap_items(user_id);
create index if not exists zap_items_status_idx on public.zap_items(status);
create index if not exists zap_items_seen_idx on public.zap_items(seen);
create index if not exists zap_items_created_at_idx on public.zap_items(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists set_app_config_updated_at on public.app_config;
create trigger set_app_config_updated_at
before update on public.app_config
for each row execute function public.set_updated_at();

drop trigger if exists set_zap_items_updated_at on public.zap_items;
create trigger set_zap_items_updated_at
before update on public.zap_items
for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.app_config enable row level security;
alter table public.zap_items enable row level security;

drop policy if exists "Server role can manage users" on public.users;
create policy "Server role can manage users"
on public.users
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Server role can manage app config" on public.app_config;
create policy "Server role can manage app config"
on public.app_config
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Server role can manage zap items" on public.zap_items;
create policy "Server role can manage zap items"
on public.zap_items
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
