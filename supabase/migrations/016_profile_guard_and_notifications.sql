-- Corrige as permissões de notificações e impede que o cliente eleve o próprio papel.
drop policy if exists own_notifications on public.notifications;
create policy notifications_select_own on public.notifications
  for select using (user_id = auth.uid() or public.is_staff());
create policy notifications_update_own on public.notifications
  for update using (user_id = auth.uid() or public.is_staff())
  with check (user_id = auth.uid() or public.is_staff());

create or replace function public.guard_profile_sensitive_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Staff may manage their assigned clients; a client never chooses its own role.
  if auth.uid() = old.id and not public.is_staff() then
    if new.role is distinct from old.role then
      raise exception 'role_cannot_be_changed_by_client';
    end if;
    if new.id is distinct from old.id then
      raise exception 'profile_identity_cannot_be_changed';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard_sensitive_fields on public.profiles;
create trigger profiles_guard_sensitive_fields
before update on public.profiles
for each row execute function public.guard_profile_sensitive_fields();

