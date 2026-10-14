export const today = () => new Date().toLocaleDateString('en-CA');
export const plans = [
  {id:'free',name:'FREE',price:0,tier:0,description:'Comece com o essencial.',features:['Exercícios básicos','Registro de peso e progresso','Calendário e metas gerais','Ranking global']},
  {id:'start',name:'START',price:600,tier:1,description:'Mais variedade para manter a consistência.',features:['Tudo do FREE','Programas completos de 30 dias','Imagens e instruções','Assistente guiado','Plano de 30 dias por modalidade']},
  {id:'pro',name:'PRO',price:1200,tier:2,description:'Conteúdo guiado e alimentação.',features:['Tudo do START','Vídeos e aulas','Conteúdos avançados','1 mentoria online com horário marcado','Corrida e estatísticas GPS']},
  {id:'premium',name:'PREMIUM',price:1800,tier:3,description:'Acompanhamento mais próximo.',features:['Tudo do PRO','Plano alimentar','2 mentorias online com horário marcado','Avaliação personalizada','Chat com coach','Grupo VIP e certificados']}
];
export const planMatrix = [
  ['Exercícios básicos','free'],['Registro de progresso','free'],['Programas de 30 dias','start'],['Vídeos e aulas','pro'],['Conteúdos avançados','pro'],['1 mentoria online marcada','pro'],['Plano alimentar','premium'],['2 mentorias online marcadas','premium'],['Corrida e estatísticas GPS','pro'],['Grupo VIP privado','premium'],['Certificados','premium']
];
export const kataCatalog = [{level:'Branco → Amarelo',names:['Shiazuki']},{level:'Amarelo → Laranja',names:['Pinan Nidan']},{level:'Laranja → Verde',names:['Pinan Shodan']},{level:'Verde → Azul',names:['Pinan Sandan']},{level:'Azul → Roxo',names:['Pinan Yondan','Pinan Godan']},{level:'Roxo → Castanho',names:['Jurokono','Matsukaze','Jiin']},{level:'Castanho',names:['Chinte','Wanshu','Seriyu','Annanku','Saifa','Sisochin']},{level:'Dan',names:['Bassai Dai','Jion','Chinto','Nipaipo','Seienchin','Seipai','Kurruunfa','Kosokun Dai']}];
export const modalities = ['Musculação','Ganho de massa','Bulking','Definição','Emagrecimento','Treino em casa','Karatê','Futsal','Natação'].map((name,i)=>({id:String(i+1),name,description:['Força com técnica e consistência','Progressão gradual de cargas','Construa sua base de força','Treino e hábitos sustentáveis','Movimento para sua rotina','Com ou sem equipamento','Base, kihon, kata e mobilidade','Passe, agilidade e condicionamento','Respiração e técnica na água'][i]}));
export const demoExercises = [
{id:'1',name:'Agachamento na cadeira',category:'Pernas',equipment:'Sem equipamento',sets:3,reps:'8–12',rest_seconds:60,min_tier:0,description:'Sente-se e levante-se de uma cadeira estável. Mantenha os pés apoiados e mova-se sem dor.'},
{id:'2',name:'Flexão na parede',category:'Peito',equipment:'Sem equipamento',sets:3,reps:'8–12',rest_seconds:60,min_tier:0,description:'Apoie as mãos na parede, mantenha o tronco alinhado e dobre os cotovelos com controle.'},
{id:'3',name:'Marcha no lugar',category:'Condicionamento',equipment:'Sem equipamento',sets:3,reps:'30 segundos',rest_seconds:60,min_tier:0,description:'Marche em ritmo confortável. Respire normalmente e use apoio se necessário.'},
{id:'4',name:'Ponte de glúteos',category:'Glúteos',equipment:'Sem equipamento',sets:3,reps:'10–15',rest_seconds:60,min_tier:0,description:'Empurre o chão com os pés e faça uma pausa no topo sem arquear a lombar.'},
{id:'5',name:'Prancha inclinada',category:'Core',equipment:'Sem equipamento',sets:3,reps:'20–40 s',rest_seconds:45,min_tier:0,description:'Apoie as mãos numa parede ou bancada e mantenha o abdômen ativo.'},
{id:'6',name:'Mobilidade torácica open book',category:'Mobilidade',equipment:'Sem equipamento',sets:2,reps:'6/lado',rest_seconds:30,min_tier:0,description:'Abra o braço de lado sem forçar a lombar ou o pescoço.'},
{id:'7',name:'Agachamento goblet',category:'Pernas',equipment:'Halteres/Mochila',sets:3,reps:'8–12',rest_seconds:75,min_tier:1,description:'Segure uma carga leve junto ao peito e controle a descida.'},
{id:'8',name:'Remada com elástico',category:'Costas',equipment:'Elástico',sets:3,reps:'8–12',rest_seconds:75,min_tier:1,description:'Prenda o elástico apenas em ponto comprovadamente seguro.'},
{id:'9',name:'Condução em zigue-zague',category:'Futsal',equipment:'Bola e cones',sets:4,reps:'30 s',rest_seconds:60,min_tier:1,description:'Conduza perto do pé e mude de direção em marcas seguras.'},
{id:'10',name:'Base e guarda de karaté',category:'Karaté',equipment:'Sem equipamento',sets:3,reps:'30 s',rest_seconds:45,min_tier:1,description:'Pratique postura e guarda sem contato, lentamente e em espaço livre.'},
{id:'11',name:'Pernada com prancha',category:'Natação',equipment:'Prancha e piscina',sets:6,reps:'25 m',rest_seconds:60,min_tier:1,description:'Faça apenas com domínio e supervisão, sem prender a respiração.'},
{id:'12',name:'Kata já aprendido no dojo',category:'Karaté',equipment:'Sem equipamento',sets:3,reps:'1–3 repetições',rest_seconds:90,min_tier:3,description:'Use a forma confirmada pelo instrutor da sua linhagem.'}
];
export const demo = () => ({
  profiles:[{id:'demo',full_name:'Visitante',role:'client',goal:'Condicionamento',height:null,onboarding_completed:false}],
  plans,modalities,exercises:demoExercises,workouts:[{id:'base',title:'Fundamentos de força · Dia 1',description:'Plano FREE • sequência introdutória de 30 dias',min_tier:0}],
 workout_exercises:demoExercises.slice(0,3).map((e,i)=>({id:String(i),workout_id:'base',exercise_id:e.id,sort_order:i})),
  training_logs:[],progress_measurements:[],content:[],subscriptions:[],payments:[],notifications:[],calendar_events:[],mentorship_bookings:[],progress_photos:[],messages:[],settings:[{id:'platform',name:'JL TRAINER ARMADURA',whatsapp:'258868787572',coach_name:'Seu coach',coach_bio:'Adicione apresentação e certificações no painel administrativo.',vip_link:null}],account_requests:[],cardio_sessions:[],exercise_battles:[]
});
export function activePlan(data,userId,now=new Date()) {
 const sub=data.subscriptions.find(s=>s.user_id===userId&&s.status==='active'&&new Date(s.started_at)<=now&&new Date(s.expires_at)>now);
 return {subscription:sub,plan:data.plans.find(p=>p.id===sub?.plan_id)||data.plans.find(p=>p.tier===0)||plans[0]};
}
export function stats(logs,measurements,now=new Date()) {
 const sorted=[...measurements].sort((a,b)=>a.measured_at.localeCompare(b.measured_at));
 const dates=new Set(logs.map(l=>new Date(l.completed_at).toLocaleDateString('en-CA')));
 let cursor=new Date(now); if(!dates.has(cursor.toLocaleDateString('en-CA'))) cursor.setDate(cursor.getDate()-1);
 let streak=0; while(dates.has(cursor.toLocaleDateString('en-CA'))){streak++;cursor.setDate(cursor.getDate()-1);}
 return {total:logs.length,month:logs.filter(l=>new Date(l.completed_at).getMonth()===now.getMonth()&&new Date(l.completed_at).getFullYear()===now.getFullYear()).length,streak,current:sorted.at(-1)?.weight??null,delta:sorted.length>1?sorted.at(-1).weight-sorted[0].weight:null};
}

