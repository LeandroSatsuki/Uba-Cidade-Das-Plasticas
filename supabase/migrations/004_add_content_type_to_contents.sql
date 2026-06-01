alter table public.contents
  add column if not exists content_type text;

update public.contents
set content_type = 'feed'
where content_type is null;

alter table public.contents
  alter column content_type set default 'feed';

alter table public.contents
  alter column content_type set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'contents_content_type_check'
      and conrelid = 'public.contents'::regclass
  ) then
    alter table public.contents
      add constraint contents_content_type_check
      check (content_type in ('feed', 'story'));
  end if;
end $$;
