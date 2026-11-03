import {modalityKeyFor} from './programs.js';

export const foodLibrary = [
  {name:'Ovos',image:'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=240&q=80',emoji:'🥚',portion:'2 unidades',kcal:140,protein:12,group:'Proteína'},
  {name:'Queijo fresco',image:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=240&q=80',emoji:'🧀',portion:'40 g',kcal:110,protein:7,group:'Proteína'},
  {name:'Arroz cozido',image:'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=240&q=80',emoji:'🍚',portion:'1 chávena',kcal:205,protein:4,group:'Carboidrato'},
  {name:'Feijão cozido',image:'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=240&q=80',emoji:'🫘',portion:'1 concha',kcal:180,protein:12,group:'Proteína e fibra'},
  {name:'Frango grelhado',image:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=240&q=80',emoji:'🍗',portion:'120 g',kcal:200,protein:37,group:'Proteína'},
  {name:'Peixe grelhado',image:'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?auto=format&fit=crop&w=240&q=80',emoji:'🐟',portion:'150 g',kcal:220,protein:32,group:'Proteína'},
  {name:'Batata-doce',image:'https://images.unsplash.com/photo-1596097635121-14b63a7d7b8c?auto=format&fit=crop&w=240&q=80',emoji:'🍠',portion:'1 média',kcal:180,protein:4,group:'Carboidrato'},
  {name:'Aveia',image:'https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=240&q=80',emoji:'🥣',portion:'40 g',kcal:150,protein:5,group:'Carboidrato e fibra'},
  {name:'Banana',image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=240&q=80',emoji:'🍌',portion:'1 unidade',kcal:105,protein:1,group:'Fruta'},
  {name:'Papaia',image:'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=240&q=80',emoji:'🍈',portion:'1 chávena',kcal:60,protein:1,group:'Fruta'},
  {name:'Amendoim',image:'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=240&q=80',emoji:'🥜',portion:'25 g',kcal:145,protein:6,group:'Gordura e proteína'},
  {name:'Iogurte natural',image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=240&q=80',emoji:'🥛',portion:'170 g',kcal:110,protein:9,group:'Proteína'},
  {name:'Abacate',image:'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=240&q=80',emoji:'🥑',portion:'1/2 unidade',kcal:160,protein:2,group:'Gordura saudável'},
  {name:'Couve e tomate',image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=240&q=80',emoji:'🥗',portion:'2 chávenas',kcal:55,protein:3,group:'Vegetais'}
];

const mealSets = {
  emagrecimento: {label:'Emagrecimento',note:'Mais volume de vegetais e proteína, com energia ajustada para redução gradual.',meals:[['Aveia','Ovos','Papaia'],['Iogurte natural','Banana'],['Peixe grelhado','Feijão cozido','Couve e tomate'],['Banana'],['Frango grelhado','Batata-doce','Couve e tomate'],['Peixe grelhado','Couve e tomate']]},
  definicao: {label:'Definição (cuting)',note:'Proteína distribuída ao longo do dia e carboidrato concentrado perto do treino.',meals:[['Ovos','Aveia','Banana'],['Iogurte natural','Papaia'],['Frango grelhado','Arroz cozido','Couve e tomate'],['Banana','Iogurte natural'],['Peixe grelhado','Batata-doce','Couve e tomate'],['Ovos','Couve e tomate']]},
  bulking: {label:'Bulking (ganho de massa)',note:'Mais energia e carboidratos para acompanhar treinos de força e recuperação.',meals:[['Aveia','Banana','Ovos','Amendoim'],['Iogurte natural','Amendoim','Banana'],['Arroz cozido','Feijão cozido','Frango grelhado','Abacate'],['Aveia','Banana','Amendoim'],['Frango grelhado','Arroz cozido','Feijão cozido','Abacate'],['Ovos','Batata-doce','Queijo fresco']]},
  musculacao: {label:'Musculação',note:'Plano equilibrado para força, proteína e recuperação entre sessões.',meals:[['Aveia','Banana','Ovos'],['Iogurte natural','Amendoim'],['Arroz cozido','Feijão cozido','Frango grelhado','Couve e tomate'],['Banana','Aveia'],['Frango grelhado','Batata-doce','Couve e tomate'],['Peixe grelhado','Arroz cozido','Couve e tomate']]},
  condicionamento: {label:'Condicionamento',note:'Energia distribuída para manter consistência e recuperação.',meals:[['Aveia','Banana','Ovos'],['Iogurte natural','Papaia','Amendoim'],['Arroz cozido','Feijão cozido','Frango grelhado','Couve e tomate'],['Banana','Aveia'],['Ovos','Arroz cozido','Feijão cozido'],['Peixe grelhado','Batata-doce','Couve e tomate']]}
};

export function nutritionPlan(profile={}) {
  const weight=Number(profile.current_weight)||70, height=Number(profile.height)||170, age=Number(profile.age)||30;
  const sex=String(profile.sex||'').toLowerCase(), bmr=10*weight+6.25*height-5*age+(sex.includes('fem')?-161:5);
  const activity=String(profile.training_level||'beginner')==='advanced'?1.6:String(profile.training_level||'')==='intermediate'?1.45:1.35;
  const modality=modalityKeyFor(profile), intensity=String(profile.training_intensity||'moderate');
  const adjustment={emagrecimento:-350,definicao:-250,bulking:350,musculacao:150,massa:250}[modality] ?? 0;
  const intensityAdjustment={easy:-80,moderate:0,hard:120}[intensity] || 0;
  const calories=Math.max(1400,Math.round(bmr*activity+adjustment+intensityAdjustment));
  const waterMl=Math.round(weight*35), extraWater=modality==='emagrecimento'||intensity==='hard'||activity>1.4?450:250;
  const training=String(profile.training_time||'18:00').slice(0,5), [h,m]=training.split(':').map(Number);
  const shift=mins=>{const d=new Date();d.setHours(h,m+mins,0,0);return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});};
  const set=mealSets[modality] || mealSets.condicionamento;
  const titles=['Pequeno-almoço','Lanche da manhã','Almoço','Pré-treino','Pós-treino','Jantar'];
  const notes=['Comece com proteína e energia de digestão gradual.','Porção ajustável à fome e rotina.','Combine carboidrato, proteína e vegetais.','Faça 60–90 minutos antes; ajuste ao seu horário.','Uma refeição normal com proteína e carboidrato apoia a recuperação.','Ajuste a porção conforme fome, rotina e orientação profissional.'];
  const times=[shift(-480),shift(-300),shift(-180),shift(-75),shift(75),shift(180)];
  const meals=titles.map((title,index)=>{const items=set.meals[index];const foods=items.map(name=>foodLibrary.find(f=>f.name===name)).filter(Boolean);return {time:times[index],title,items,note:notes[index],kcal:foods.reduce((sum,f)=>sum+f.kcal,0),protein:foods.reduce((sum,f)=>sum+f.protein,0),recipe:index===0?'Misture e cozinhe até ficar cremoso.':index===2?'Monte o prato com metade de vegetais, proteína e carboidrato.':index===3?'Combine os itens e deixe pronto 60–90 minutos antes do treino.':'Prepare de forma simples, sem fritura e com hidratação.'}});
  meals.splice(4,0,{time:training,title:'Treino',items:[],note:'Beba pequenos goles; pare se sentir tontura, dor ou mal-estar.'});
  return {calories,waterMl:waterMl+extraWater,bmr:Math.round(bmr),meals,training,modalityLabel:set.label,modalityNote:set.note,creatine:'Se um profissional de saúde autorizar: creatina monohidratada costuma ser estudada em 3–5 g/dia. O horário não é mágico; a consistência importa mais. Não usar automaticamente em menores, gravidez, doença renal ou com medicamentos sem avaliação.'};
}

export function estimateWorkoutKcal(profile={},minutes=35,intensity='moderate') {
  const weight=Number(profile.current_weight)||70, met=intensity==='hard'?8:intensity==='easy'?3.5:5.5;
  return Math.round(met*3.5*weight/200*minutes);
}
