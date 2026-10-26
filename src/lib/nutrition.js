export const foodLibrary = [
  {name:'Ovos',emoji:'🥚',portion:'2 unidades',kcal:140,protein:12,group:'Proteína'},
  {name:'Queijo fresco',emoji:'🧀',portion:'40 g',kcal:110,protein:7,group:'Proteína'},
  {name:'Arroz cozido',emoji:'🍚',portion:'1 chávena',kcal:205,protein:4,group:'Carboidrato'},
  {name:'Feijão cozido',emoji:'🫘',portion:'1 concha',kcal:180,protein:12,group:'Proteína e fibra'},
  {name:'Frango grelhado',emoji:'🍗',portion:'120 g',kcal:200,protein:37,group:'Proteína'},
  {name:'Peixe grelhado',emoji:'🐟',portion:'150 g',kcal:220,protein:32,group:'Proteína'},
  {name:'Batata-doce',emoji:'🍠',portion:'1 média',kcal:180,protein:4,group:'Carboidrato'},
  {name:'Aveia',emoji:'🥣',portion:'40 g',kcal:150,protein:5,group:'Carboidrato e fibra'},
  {name:'Banana',emoji:'🍌',portion:'1 unidade',kcal:105,protein:1,group:'Fruta'},
  {name:'Papaia',emoji:'🍈',portion:'1 chávena',kcal:60,protein:1,group:'Fruta'},
  {name:'Amendoim',emoji:'🥜',portion:'25 g',kcal:145,protein:6,group:'Gordura e proteína'},
  {name:'Iogurte natural',emoji:'🥛',portion:'170 g',kcal:110,protein:9,group:'Proteína'},
  {name:'Abacate',emoji:'🥑',portion:'1/2 unidade',kcal:160,protein:2,group:'Gordura saudável'},
  {name:'Couve e tomate',emoji:'🥗',portion:'2 chávenas',kcal:55,protein:3,group:'Vegetais'}
];

export function nutritionPlan(profile={}) {
  const weight=Number(profile.current_weight)||70, height=Number(profile.height)||170, age=Number(profile.age)||30;
  const sex=String(profile.sex||'').toLowerCase();
  const bmr=10*weight+6.25*height-5*age+(sex.includes('fem')?-161:5);
  const activity=String(profile.training_level||'beginner')==='advanced'?1.6:String(profile.training_level||'')==='intermediate'?1.45:1.35;
  const goal=String(profile.goal||'').toLowerCase();
  const adjustment=goal.includes('emag')?-350:goal.includes('massa')||goal.includes('bulk')?250:0;
  const calories=Math.max(1400,Math.round(bmr*activity+adjustment));
  const waterMl=Math.round(weight*35);
  const extraWater=goal.includes('emag')||activity>1.4?400:250;
  const training=String(profile.training_time||'18:00').slice(0,5);
  const [h,m]=training.split(':').map(Number);
  const shift=(mins)=>{const d=new Date();d.setHours(h,m+mins,0,0);return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})};
  const meals=[
    {time:shift(-480),title:'Pequeno-almoço',items:['Aveia','Banana','Ovos'],note:'Comece com proteína e energia de digestão gradual.'},
    {time:shift(-300),title:'Lanche da manhã',items:['Iogurte natural','Papaia','Amendoim'],note:'Porção ajustável à fome e rotina.'},
    {time:shift(-180),title:'Almoço',items:['Arroz cozido','Feijão cozido','Frango grelhado','Couve e tomate'],note:'Combine carboidrato, feijão, proteína e vegetais.'},
    {time:shift(-75),title:'Pré-treino',items:['Banana','Aveia'],note:'Faça 60–90 minutos antes; reduza a porção se treinar logo.'},
    {time:training,title:'Treino',items:[],note:'Beba pequenos goles; pare se sentir tontura ou dor.'},
    {time:shift(75),title:'Pós-treino',items:['Ovos','Arroz cozido','Feijão cozido'],note:'Uma refeição normal com proteína e carboidrato é suficiente para a maioria.'},
    {time:shift(180),title:'Jantar',items:['Peixe grelhado','Batata-doce','Couve e tomate'],note:'Troque peixe por frango, ovos ou feijão conforme disponibilidade.'}
  ];
  return {calories,waterMl:waterMl+extraWater,bmr:Math.round(bmr),meals,training,creatine:'Se um profissional de saúde autorizar: creatina monohidratada costuma ser estudada em 3–5 g/dia. O horário não é mágico; a consistência importa mais. Não usar automaticamente em menores, gravidez, doença renal ou com medicamentos sem avaliação.'};
}

export function estimateWorkoutKcal(profile={},minutes=35,intensity='moderate'){
  const weight=Number(profile.current_weight)||70;
  const met=intensity==='hard'?8:intensity==='easy'?3.5:5.5;
  return Math.round(met*3.5*weight/200*minutes);
}
