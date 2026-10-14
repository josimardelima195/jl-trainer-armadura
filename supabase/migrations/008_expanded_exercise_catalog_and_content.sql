-- Catálogo ampliado: alternativas com e sem equipamento e conteúdos educativos.
insert into public.exercises(name,category,description,muscle_group,sets,reps,rest_seconds,equipment,min_tier) select * from (values
('Agachamento livre','Pernas','Desça até uma amplitude confortável, joelhos acompanhando os pés e tronco controlado. Regresse para cadeira; progrida com pausa ou mochila.','Quadríceps e glúteos',3,'8–12',60,'Sem equipamento',0),
('Agachamento goblet','Pernas','Segure um halter ou mochila junto ao peito. Use carga leve e controle a descida.','Quadríceps e glúteos',3,'8–12',75,'Halteres/Mochila',1),
('Flexão na parede','Peito','Mãos na parede, corpo alinhado e cotovelos controlados. Progrida para bancada, joelhos e chão.','Peito e tríceps',3,'8–12',60,'Sem equipamento',0),
('Flexão inclinada','Peito','Apoie as mãos numa bancada firme. Mantenha tronco alinhado e desça sem dor.','Peito e tríceps',3,'6–12',75,'Bancada',0),
('Remada com elástico','Costas','Prenda o elástico apenas num ponto comprovadamente seguro e puxe com as escápulas controladas.','Costas e bíceps',3,'8–12',75,'Elástico',1),
('Remada com mochila','Costas','Apoie uma mão numa superfície estável e puxe a mochila sem torcer o tronco.','Costas e bíceps',3,'8–12',75,'Mochila',1),
('Ponte de glúteos','Glúteos','Deitado, empurre o chão com os pés e pause no topo sem hiperarquear a lombar.','Glúteos',3,'10–15',60,'Sem equipamento',0),
('Levantamento romeno com mochila','Posterior','Aprenda primeiro a dobradiça de quadril; coluna neutra e carga próxima ao corpo.','Posterior e glúteos',3,'8–12',90,'Mochila',1),
('Elevação de panturrilha','Pernas','Segure uma cadeira estável, suba e desça lentamente. Progrida para unilateral.','Panturrilhas',3,'12–20',45,'Sem equipamento',0),
('Prancha inclinada','Core','Apoie mãos numa parede ou bancada e mantenha abdômen ativo sem prender a respiração.','Core',3,'20–40 s',45,'Sem equipamento',0),
('Dead bug','Core','Movimente braços e pernas lentamente mantendo a lombar confortável.','Core',3,'6–10/lado',45,'Sem equipamento',0),
('Marcha rápida no lugar','Cardio','Marche com ritmo que permita falar frases. Reduza o ritmo se perder controle.','Cardio',4,'1 min',45,'Sem equipamento',0),
('Caminhada-trote intervalado','Cardio','Alterne trote fácil e caminhada; comece com blocos curtos e aumente uma variável de cada vez.','Cardio',6,'30 s / 90 s',60,'Sem equipamento',0),
('Condução em zigue-zague','Futsal','Conduza a bola perto do pé e mude de direção em marcas seguras e planas.','Futsal',4,'30 s',60,'Bola e cones',1),
('Passe e primeiro toque','Futsal','Treine passe com o interior do pé e recepção orientada, primeiro sem pressão.','Futsal',4,'10 passes',45,'Bola',1),
('Rondo 3 contra 1','Futsal','Use área adequada, regras locais e pausas; aumente a pressão gradualmente.','Futsal',4,'60 s',90,'Bola e coletes',2),
('Respiração do crawl','Natação','Pratique expiração suave e rotação confortável com instrutor e água segura. Nunca faça hiperventilação.','Natação',4,'30 s',45,'Piscina',1),
('Pernada com prancha','Natação','Use prancha apenas com domínio e supervisão; distância curta e sem prender a respiração.','Natação',6,'25 m',60,'Prancha e piscina',1),
('Deslize da parede','Natação','Impulso suave, streamline e retorno para ficar em pé; faça em faixa segura.','Natação',6,'10–15 m',60,'Piscina',1),
('Base e guarda de karaté','Karaté','Pratique postura, respiração e guarda sem contato, lentamente e em espaço livre.','Karaté',3,'30 s',45,'Sem equipamento',1),
('Deslocamento kihon sem contato','Karaté','Passos curtos para frente, trás e lateral, sem parceiro, alvo ou impacto.','Karaté',4,'30 s',45,'Sem equipamento',1),
('Kata já aprendido no dojo','Karaté','Use apenas a forma confirmada pelo instrutor da sua linhagem; vídeo não substitui correção presencial.','Karaté',3,'1–3 repetições',90,'Sem equipamento',3),
('Sentar e levantar da cadeira','Iniciantes','Use cadeira firme e apoio se necessário. Controle a descida e regresse sem dor.','Corpo inteiro',2,'5–10',60,'Cadeira',0),
('Mobilidade torácica open book','Mobilidade','De lado, joelhos apoiados, abra o braço sem forçar a lombar ou o pescoço.','Mobilidade',2,'6/lado',30,'Sem equipamento',0),
('Equilíbrio com apoio','Mobilidade','Fique perto de parede ou cadeira e transfira o peso lentamente.','Equilíbrio',2,'20 s/lado',30,'Sem equipamento',0),
('Desenvolvimento de ombros','Ombros','Use halteres leves e amplitude confortável, sem elevar os ombros em excesso.','Ombros',3,'8–12',75,'Halteres',1),
('Split squat assistido','Pernas','Segure apoio estável e desça com amplitude confortável; progrida gradualmente.','Pernas',3,'6–10/lado',75,'Sem equipamento',1),
('Shadow boxing sem contato','Cardio','Movimentos controlados no ar, sem alvo, sem potência máxima e com espaço livre.','Cardio e coordenação',4,'30 s',45,'Sem equipamento',1),
('Step-up baixo','Pernas','Use degrau baixo e apoio próximo. Controle subida e descida sem saltar.','Pernas',3,'6–10/lado',60,'Degrau',1)
) as x(name,category,description,muscle_group,sets,reps,rest_seconds,equipment,min_tier)
where not exists(select 1 from public.exercises e where e.name=x.name);

insert into public.content(title,description,type,bucket,path,min_plan,published)
select 'Guia oficial Kimura Shukokai: katas e syllabus','Referência da Shukokai Karate Federation. Use o dojo e o instrutor para confirmar a execução e a graduação.','text','documents','https://www.shukokai-skf.com/training-with-skf/kata/',p.id,true from public.plans p where p.tier=3 and not exists(select 1 from public.content c where c.title='Guia oficial Kimura Shukokai: katas e syllabus');
insert into public.content(title,description,type,bucket,path,min_plan,published)
select 'Guia Alimentar para a População Brasileira','Base educativa: priorizar alimentos in natura ou minimamente processados e limitar ultraprocessados. Não substitui nutricionista.','document','documents','https://bvsms.saude.gov.br/bvs/publicacoes/guia_alimentar_populacao_brasileira_2ed.pdf',p.id,true from public.plans p where p.tier=3 and not exists(select 1 from public.content c where c.title='Guia Alimentar para a População Brasileira');
