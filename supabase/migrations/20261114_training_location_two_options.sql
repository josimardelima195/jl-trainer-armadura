alter table public.profiles
  alter column training_location set default 'casa';

update public.profiles
set training_location = 'casa'
where training_location is null
   or training_location not in ('casa', 'ginasio');

alter table public.profiles
  drop constraint if exists profiles_training_location_check;

alter table public.profiles
  add constraint profiles_training_location_check
  check (training_location in ('casa', 'ginasio'));
