alter table public.profiles
  add column if not exists phone text,
  add column if not exists city text,
  add column if not exists birth_date date,
  add column if not exists avatar_url text,
  add column if not exists plastic_surgery_interests text[] not null default '{}'::text[];

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
