-- Tabelas, funções e políticas RLS do portfólio.
-- Aplique pelo SQL Editor do Supabase ou com `supabase db push`.

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 200),
  subject text not null check (char_length(subject) between 1 and 150),
  message text not null check (char_length(message) between 20 and 5000),
  replied boolean not null default false,
  replied_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists messages_created_at_idx on public.messages (created_at desc);
create index if not exists messages_email_created_idx on public.messages (email, created_at desc);

create table if not exists public.featured_projects (
  repo_name text primary key,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Verifica se o usuário autenticado é administrador.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
alter table public.messages enable row level security;
alter table public.featured_projects enable row level security;

-- admins: cada usuário só enxerga a própria linha (usado pelo front para checar acesso).
-- Sem políticas de escrita: administradores são cadastrados manualmente (ver docs/SETUP.md).
create policy "admins_select_own" on public.admins
  for select to authenticated using (user_id = auth.uid());

-- messages: SEM insert público. Só a Edge Function (service role, que ignora RLS) insere.
create policy "messages_admin_select" on public.messages
  for select to authenticated using (public.is_admin());
create policy "messages_admin_update" on public.messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "messages_admin_delete" on public.messages
  for delete to authenticated using (public.is_admin());

-- featured_projects: leitura pública; escrita só do administrador.
create policy "featured_public_select" on public.featured_projects
  for select to anon, authenticated using (true);
create policy "featured_admin_insert" on public.featured_projects
  for insert to authenticated with check (public.is_admin());
create policy "featured_admin_update" on public.featured_projects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "featured_admin_delete" on public.featured_projects
  for delete to authenticated using (public.is_admin());
