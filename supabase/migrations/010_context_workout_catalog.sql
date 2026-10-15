-- JL Trainer: catálogo inicial organizado por modalidade e local.
-- Os nomes são educativos; a técnica deve ser validada por um profissional quando necessário.
insert into public.modalities(name,description,sort_order)
values ('Ginásio','Programas com máquinas, cabos e pesos livres',10)
on conflict(name) do update set description=excluded.description;

insert into public.exercises(name,category,description,muscle_group,sets,reps,rest_seconds,equipment,min_tier)
select v.name,v.category,v.description,v.muscle_group,v.sets,v.reps,v.rest_seconds,v.equipment,v.min_tier
from (values
 ('Leg press 45°','Pernas','Empurre a plataforma com os pés estáveis; não trave os joelhos e use carga controlada.','Quadríceps e glúteos',3,'8–12',90,'Ginásio',1),
 ('Supino com halteres','Peito','Desça os halteres com controle, mantenha os ombros apoiados e não force a amplitude.','Peito e tríceps',3,'8–12',90,'Ginásio',1),
 ('Puxada na frente','Costas','Puxe a barra ao alto do peito sem balançar o tronco nem puxar atrás da nuca.','Costas e bíceps',3,'8–12',90,'Ginásio',1),
 ('Desenvolvimento sentado','Ombros','Empurre os halteres acima da cabeça mantendo as costelas controladas.','Ombros e tríceps',3,'8–12',75,'Ginásio',1),
 ('Levantamento terra romeno','Posterior','Deslize o peso junto às pernas e pare quando perder a posição neutra da coluna.','Posterior e glúteos',3,'8–10',105,'Ginásio',1),
 ('Caminhada inclinada','Condicionamento','Caminhe em ritmo sustentável e ajuste inclinação e velocidade ao seu nível.','Cardio',1,'15–25 min',60,'Ginásio',1),
 ('Agachamento livre sem carga','Pernas','Desça até onde mantém controle, joelhos acompanhando a direção dos pés.','Pernas e glúteos',3,'8–15',60,'Sem equipamento',0),
 ('Flexão inclinada em bancada','Peito','Mantenha o corpo alinhado e aproxime o peito da bancada sem deixar o quadril cair.','Peito e tríceps',3,'6–12',60,'Sem equipamento',0),
 ('Afundo reverso','Pernas','Dê um passo para trás e desça com controle, usando apoio se necessário.','Pernas e glúteos',3,'8/lado',60,'Sem equipamento',0),
 ('Dead bug','Core','Mantenha a lombar confortável no chão e mova braços e pernas sem pressa.','Abdômen e postura',3,'8/lado',45,'Sem equipamento',0),
 ('Acelerações curtas com bola','Futsal','Faça deslocamentos curtos com mudanças de direção e recuperação completa.','Velocidade e agilidade',6,'20 s',60,'Bola e cones',1),
 ('Kihon: oi-zuki e age-uke','Karatê','Pratique lentamente, sem contato, em base estável e com orientação do dojo.','Coordenação e técnica',4,'30 s',45,'Sem equipamento',1),
 ('Respiração lateral na água','Natação','Treine a expiração dentro da água com supervisão e nunca nade sozinho.','Técnica e respiração',6,'25 m',60,'Piscina',1)
) as v(name,category,description,muscle_group,sets,reps,rest_seconds,equipment,min_tier)
where not exists(select 1 from public.exercises e where e.name=v.name);

do $$
declare
  item record;
  wid uuid;
  mid uuid;
  eid uuid;
  ex text;
begin
  for item in select * from (values
    ('Emagrecimento','Emagrecimento · Ginásio · Cardio e força','Treino inicial de ginásio para emagrecimento: força moderada e cardio sustentável.',array['Leg press 45°','Supino com halteres','Puxada na frente','Caminhada inclinada']),
    ('Emagrecimento','Emagrecimento · Em casa · Corpo inteiro','Treino sem equipamento para aumentar movimento com progressão segura.',array['Agachamento livre sem carga','Flexão inclinada em bancada','Afundo reverso','Dead bug']),
    ('Musculação','Musculação · Ginásio · Peito e costas','Sessão de força com técnica, descanso e progressão gradual.',array['Supino com halteres','Puxada na frente','Desenvolvimento sentado','Leg press 45°']),
    ('Ganho de massa','Ganho de massa · Ginásio · Base de força','Base de hipertrofia com execução controlada e carga progressiva.',array['Leg press 45°','Supino com halteres','Puxada na frente','Levantamento terra romeno']),
    ('Bulking','Bulking · Ginásio · Força progressiva','Treino de força para apoiar ganho de massa com recuperação adequada.',array['Agachamento livre sem carga','Supino com halteres','Puxada na frente','Levantamento terra romeno']),
    ('Treino em casa','Treino em casa · Sem equipamento · Corpo inteiro','Programa doméstico sem máquinas ou pesos.',array['Agachamento livre sem carga','Flexão inclinada em bancada','Afundo reverso','Dead bug']),
    ('Futsal','Futsal · Campo · Velocidade e agilidade','Aceleração, condução e controle em espaço seguro.',array['Acelerações curtas com bola','Agachamento livre sem carga','Dead bug']),
    ('Karatê','Karatê · Dojo · Kihon e condicionamento','Base técnica sem contato; kata e bunkai devem seguir o instrutor.',array['Kihon: oi-zuki e age-uke','Agachamento livre sem carga','Dead bug']),
    ('Natação','Natação · Piscina · Técnica e respiração','Sessão introdutória na água com supervisão.',array['Respiração lateral na água'])
  ) as t(modality_name,title,description,exercise_names)
  loop
    select id into mid from public.modalities where name=item.modality_name limit 1;
    if mid is null then continue; end if;
    select id into wid from public.workouts where modality_id=mid and title=item.title limit 1;
    if wid is null then
      insert into public.workouts(modality_id,title,description,min_tier,active) values(mid,item.title,item.description,case when item.modality_name in ('Emagrecimento','Treino em casa') then 0 else 1 end,true) returning id into wid;
    end if;
    foreach ex in array item.exercise_names loop
      select id into eid from public.exercises where name=ex limit 1;
      if eid is not null then
        insert into public.workout_exercises(workout_id,exercise_id,sort_order)
        select wid,eid,coalesce(max(sort_order),-1)+1 from public.workout_exercises where workout_id=wid
        and not exists(select 1 from public.workout_exercises where workout_id=wid and exercise_id=eid);
      end if;
    end loop;
  end loop;
end $$;
