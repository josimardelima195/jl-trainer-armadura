alter table public.profiles
  add column if not exists training_location text not null default 'casa';

comment on column public.profiles.training_location is
  'Preferred training location: casa or ginasio.';
