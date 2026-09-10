export const today = () => new Date().toLocaleDateString('en-CA');
export const plans = [
  {id:'free',name:'GRÁTIS',price:0,tier:0,features:['3 exercícios introdutórios','Registro de peso','Chat e vídeos bloqueados']},
  {id:'start',name:'START',price:600,tier:1,features:['Treinos completos','Imagens e instruções','Assistente guiado e grupo VIP']},
  {id:'pro',name:'PRO',price:1200,tier:2,features:['Tudo do START','Videoaulas','2 mentorias por mês']},
  {id:'premium',name:'PREMIUM',price:1800,tier:3,features:['Tudo do PRO','Treino personalizado','Suporte prioritário']}
];
export const modalities = ['Musculação','Ganho de massa','Bulking','Definição','Emagrecimento','Treino em casa','Karatê','Futsal','Natação'].map((name,i)=>({id:String(i+1),name,description:['Força com técnica e consistência','Progressão gradual de cargas','Construa sua base de força','Treino e hábitos sustentáveis','Movimento para sua rotina','Com ou sem equipamento','Base, kihon, kata e mobilidade','Passe, agilidade e condicionamento','Respiração e técnica na água'][i]}));
export const demoExercises = [
 {id:'1',name:'Agachamento na cadeira',category:'Pernas',equipment:'Sem equipamento',sets:3,reps:'8–12',rest_seconds:60,min_tier:0,description:'Sente-se e levante-se de uma cadeira estável. Mantenha os pés apoiados e mova-se sem dor.'},
 {id:'2',name:'Flexão na parede',category:'Peito',equipment:'Sem equipamento',sets:3,reps:'8–12',rest_seconds:60,min_tier:0,description:'Apoie as mãos na parede, mantenha o tronco alinhado e dobre os cotovelos com controle.'},
 {id:'3',name:'Marcha no lugar',category:'Condicionamento',equipment:'Sem equipamento',sets:3,reps:'30 segundos',rest_seconds:60,min_tier:0,description:'Marche em ritmo confortável. Respire normalmente e use apoio se necessário.'},
 {id:'4',name:'Supino com halteres',category:'Peito',equipment:'Halteres',sets:4,reps:'10–12',rest_seconds:90,min_tier:1,description:'Use uma carga confortável e um banco estável. Peça ao coach para conferir sua técnica.'}
];
export const demo = () => ({
 profiles:[{id:'demo',full_name:'Visitante',role:'client',goal:'Condicionamento',height:null}],
 plans,modalities,exercises:demoExercises,workouts:[{id:'base',title:'Fundamentos de força',description:'Sequência introdutória • exemplo editável',min_tier:0}],
 workout_exercises:demoExercises.slice(0,3).map((e,i)=>({id:String(i),workout_id:'base',exercise_id:e.id,sort_order:i})),
 training_logs:[],progress_measurements:[],content:[],subscriptions:[],payments:[],notifications:[],calendar_events:[],mentorship_bookings:[],progress_photos:[],messages:[],settings:[{id:'platform',name:'JL TRAINER ARMADURA',whatsapp:'258868787572',coach_name:'Seu coach',coach_bio:'Adicione apresentação e certificações no painel administrativo.',vip_link:null}],account_requests:[]
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

