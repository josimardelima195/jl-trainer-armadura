-- Benefícios reais dos quatro planos e desbloqueio após confirmação administrativa do pagamento.
update public.plans set features='["Exercícios básicos","Registro de peso e progresso","Calendário e metas gerais","Ranking global"]' where tier=0;
update public.plans set features='["Tudo do FREE","Programa de treino por modalidade","Plano de 30 dias","Imagens e instruções","Assistente guiado"]' where tier=1;
update public.plans set features='["Tudo do START","Vídeos e aulas","Conteúdos avançados","1 mentoria online com horário marcado","Corrida e estatísticas GPS"]' where tier=2;
update public.plans set features='["Tudo do PRO","Plano alimentar","2 mentorias online com horário marcado","Avaliação personalizada","Chat com coach","Grupo VIP e certificados"]' where tier=3;

create or replace function public.admin_confirm_payment(payment_id uuid) returns void language plpgsql security definer set search_path=public as $$
declare p public.payments; begin
 if not public.is_admin() then raise exception 'admin_required'; end if;
 select * into p from public.payments where id=payment_id for update;
 if p.id is null then raise exception 'payment_not_found'; end if;
 update public.payments set status='confirmed',confirmed_at=now(),confirmed_by=auth.uid() where id=payment_id;
 update public.subscriptions set status='suspended' where user_id=p.user_id and status='active';
 insert into public.subscriptions(user_id,plan_id,status,started_at,expires_at,payment_status,payment_reference)
 values(p.user_id,p.plan_id,'active',current_date,(current_date + interval '30 days')::date,'confirmed',p.reference);
end; $$;

create or replace function public.book_mentorship(event uuid) returns void language plpgsql security definer set search_path=public as $$
declare tier int; used_count int; max_count int; begin
 select coalesce(max(pl.tier),0) into tier from public.subscriptions s join public.plans pl on pl.id=s.plan_id where s.user_id=auth.uid() and s.status='active' and s.expires_at>=current_date;
 max_count:=case when tier>=3 then 2 when tier=2 then 1 else 0 end;
 if max_count=0 then raise exception 'mentorship_plan_required'; end if;
 select count(*) into used_count from public.mentorship_bookings b join public.calendar_events e on e.id=b.event_id where b.user_id=auth.uid() and e.kind='mentorship' and date_trunc('month',e.starts_at)=date_trunc('month',now());
 if used_count>=max_count then raise exception 'monthly_mentorship_limit'; end if;
 insert into public.mentorship_bookings(event_id,user_id) values(event,auth.uid());
end; $$;
