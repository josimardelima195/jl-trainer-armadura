alter table public.profiles
  add column if not exists target_weight numeric;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'profiles_target_weight_range'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_target_weight_range
      check (target_weight is null or target_weight between 25 and 300);
  end if;
end $$;
