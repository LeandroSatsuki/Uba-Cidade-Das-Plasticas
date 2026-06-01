create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  role text not null default 'user',
  premium_status text not null default 'none',
  premium_since date null,
  premium_until date null,
  stripe_customer_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = case
          when excluded.full_name = '' then public.profiles.full_name
          else excluded.full_name
        end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.handle_auth_user_profile_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set
    email = new.email,
    full_name = coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), full_name),
    updated_at = now()
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update on auth.users
for each row execute function public.handle_auth_user_profile_update();

create or replace function public.prevent_sensitive_profile_changes()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if new.role is distinct from old.role then
      raise exception 'role cannot be changed by authenticated users';
    end if;

    if new.premium_status is distinct from old.premium_status then
      raise exception 'premium_status cannot be changed by authenticated users';
    end if;

    if new.premium_since is distinct from old.premium_since then
      raise exception 'premium_since cannot be changed by authenticated users';
    end if;

    if new.premium_until is distinct from old.premium_until then
      raise exception 'premium_until cannot be changed by authenticated users';
    end if;

    if new.stripe_customer_id is distinct from old.stripe_customer_id then
      raise exception 'stripe_customer_id cannot be changed by authenticated users';
    end if;
  end if;

  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.prevent_sensitive_profile_changes();

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
