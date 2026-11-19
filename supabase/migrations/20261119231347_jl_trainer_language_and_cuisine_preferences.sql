alter table public.profiles
  add column if not exists language text not null default 'pt',
  add column if not exists cuisine_preference text not null default 'mixed';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_language_supported'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_language_supported
      check (language in ('pt','en','fr','es','zh','hi'));
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_cuisine_preference_supported'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_cuisine_preference_supported
      check (cuisine_preference in ('mozambican','international','mixed'));
  end if;
end $$;
