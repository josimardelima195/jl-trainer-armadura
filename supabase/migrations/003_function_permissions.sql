-- JL Trainer Armadura: reduzir exposição das funções SECURITY DEFINER.
-- As funções continuam protegidas internamente por is_admin/is_staff, mas não ficam
-- executáveis anonimamente através da API REST.
revoke execute on function public.admin_activate_subscription(uuid, uuid, date, text) from public, anon;
revoke execute on function public.admin_confirm_payment(uuid) from public, anon;
revoke execute on function public.book_mentorship(uuid) from public, anon;
revoke execute on function public.guided_chat(text) from public, anon;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.is_admin() from public, anon, authenticated;
revoke execute on function public.is_staff() from public, anon, authenticated;
grant execute on function public.admin_activate_subscription(uuid, uuid, date, text) to authenticated;
grant execute on function public.admin_confirm_payment(uuid) to authenticated;
grant execute on function public.book_mentorship(uuid) to authenticated;
grant execute on function public.guided_chat(text) to authenticated;
