create extension if not exists pgcrypto;

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  base44_id text unique,
  nome text not null,
  foto_perfil_url text,
  especialidades text,
  descricao_curta text,
  formacao text,
  crm text,
  registro_sbcp text,
  telefone text,
  whatsapp text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contents (
  id uuid primary key default gen_random_uuid(),
  base44_id text unique,
  professional_id uuid references public.professionals(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  imagem_url text,
  legenda text not null,
  is_premium boolean not null default false,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_likes (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (content_id, user_id)
);

create table if not exists public.content_comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.contents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.professionals enable row level security;
alter table public.contents enable row level security;
alter table public.content_likes enable row level security;
alter table public.content_comments enable row level security;

drop policy if exists "professionals_select_active" on public.professionals;
create policy "professionals_select_active"
  on public.professionals
  for select
  to public
  using (ativo = true or public.is_admin_user());

drop policy if exists "professionals_admin_insert" on public.professionals;
create policy "professionals_admin_insert"
  on public.professionals
  for insert
  to authenticated
  with check (public.is_admin_user());

drop policy if exists "professionals_admin_update" on public.professionals;
create policy "professionals_admin_update"
  on public.professionals
  for update
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists "professionals_admin_delete" on public.professionals;
create policy "professionals_admin_delete"
  on public.professionals
  for delete
  to authenticated
  using (public.is_admin_user());

drop policy if exists "contents_select_active" on public.contents;
create policy "contents_select_active"
  on public.contents
  for select
  to public
  using (ativo = true or public.is_admin_user());

drop policy if exists "contents_admin_insert" on public.contents;
create policy "contents_admin_insert"
  on public.contents
  for insert
  to authenticated
  with check (public.is_admin_user());

drop policy if exists "contents_admin_update" on public.contents;
create policy "contents_admin_update"
  on public.contents
  for update
  to authenticated
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists "contents_admin_delete" on public.contents;
create policy "contents_admin_delete"
  on public.contents
  for delete
  to authenticated
  using (public.is_admin_user());

drop policy if exists "likes_authenticated_select" on public.content_likes;
create policy "likes_authenticated_select"
  on public.content_likes
  for select
  to authenticated
  using (true);

drop policy if exists "likes_authenticated_insert_own" on public.content_likes;
create policy "likes_authenticated_insert_own"
  on public.content_likes
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "likes_authenticated_delete_own" on public.content_likes;
create policy "likes_authenticated_delete_own"
  on public.content_likes
  for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "comments_public_select" on public.content_comments;
create policy "comments_public_select"
  on public.content_comments
  for select
  to public
  using (true);

drop policy if exists "comments_authenticated_insert_own" on public.content_comments;
create policy "comments_authenticated_insert_own"
  on public.content_comments
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "comments_authenticated_update_own" on public.content_comments;
create policy "comments_authenticated_update_own"
  on public.content_comments
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "comments_authenticated_delete_own_or_admin" on public.content_comments;
create policy "comments_authenticated_delete_own_or_admin"
  on public.content_comments
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin_user());

drop trigger if exists set_professionals_updated_at on public.professionals;
create trigger set_professionals_updated_at
before update on public.professionals
for each row execute function public.set_updated_at();

drop trigger if exists set_contents_updated_at on public.contents;
create trigger set_contents_updated_at
before update on public.contents
for each row execute function public.set_updated_at();

drop trigger if exists set_content_comments_updated_at on public.content_comments;
create trigger set_content_comments_updated_at
before update on public.content_comments
for each row execute function public.set_updated_at();

create index if not exists idx_professionals_base44_id on public.professionals(base44_id);
create index if not exists idx_contents_base44_id on public.contents(base44_id);
create index if not exists idx_contents_professional_id on public.contents(professional_id);
create index if not exists idx_content_likes_content_id on public.content_likes(content_id);
create index if not exists idx_content_likes_user_id on public.content_likes(user_id);
create index if not exists idx_content_comments_content_id on public.content_comments(content_id);
create index if not exists idx_content_comments_user_id on public.content_comments(user_id);
