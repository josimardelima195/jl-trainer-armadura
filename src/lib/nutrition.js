import {modalityKeyFor} from './programs.js';

// Valores de referência aproximados por porção indicada. São estimativas educativas,
// não prescrição clínica. Imagens só são usadas quando correspondem ao alimento.
export const foodLibrary = [
 {id:'oats',name:'Aveia',portion:'40 g',kcal:150,protein:5,carbs:27,fat:3,fiber:4,group:'Carboidrato e fibra',emoji:'Aveia',image:'/assets/food/aveia-simples.jpg'},
 {id:'banana',name:'Banana',portion:'1 unidade',kcal:105,protein:1,carbs:27,fat:0,fiber:3,group:'Fruta',emoji:'Banana',image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=240&q=80'},
 {id:'eggs',name:'Ovos',portion:'2 unidades',kcal:140,protein:12,carbs:1,fat:10,fiber:0,group:'Proteína',emoji:'Ovos',image:'/assets/food/ovos-cozidos.jpg'},
 {id:'milk',name:'Leite',portion:'250 ml',kcal:120,protein:8,carbs:12,fat:5,fiber:0,group:'Proteína',emoji:'Leite',image:'/assets/food/leite-copo.jpg'},
 {id:'yogurt',name:'Iogurte natural',portion:'170 g',kcal:110,protein:9,carbs:12,fat:3,fiber:0,group:'Proteína',emoji:'Iogurte',image:'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=240&q=80'},
 {id:'fresh-cheese',name:'Queijo fresco',portion:'40 g',kcal:110,protein:7,carbs:2,fat:8,fiber:0,group:'Proteína',emoji:'Queijo',image:'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=240&q=80'},
 {id:'chicken',name:'Frango grelhado',portion:'120 g',kcal:200,protein:37,carbs:0,fat:5,fiber:0,group:'Proteína',emoji:'Frango',image:'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=240&q=80'},
 {id:'fish',name:'Peixe grelhado',portion:'150 g',kcal:220,protein:32,carbs:0,fat:9,fiber:0,group:'Proteína',emoji:'Peixe',image:'/assets/food/peixe-grelhado.jpg'},
 {id:'beef',name:'Carne magra',portion:'120 g',kcal:250,protein:32,carbs:0,fat:13,fiber:0,group:'Proteína',emoji:'Carne'},
 {id:'tuna',name:'Atum',portion:'1 lata escorrida',kcal:160,protein:34,carbs:0,fat:2,fiber:0,group:'Proteína',emoji:'Atum'},
 {id:'rice',name:'Arroz cozido',portion:'1 chávena',kcal:205,protein:4,carbs:45,fat:0,fiber:1,group:'Carboidrato',emoji:'Arroz',image:'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=240&q=80'},
 {id:'sweet-potato',name:'Batata-doce',portion:'1 média',kcal:180,protein:4,carbs:41,fat:0,fiber:6,group:'Carboidrato',emoji:'Batata-doce',image:'/assets/food/batata-doce-assada.jpg'},
 {id:'cassava',name:'Mandioca',portion:'150 g',kcal:240,protein:2,carbs:58,fat:0,fiber:3,group:'Carboidrato',emoji:'Mandioca'},
 {id:'pasta',name:'Massa integral',portion:'1 chávena',kcal:200,protein:8,carbs:39,fat:2,fiber:5,group:'Carboidrato',emoji:'Massa'},
 {id:'whole-bread',name:'Pão integral',portion:'2 fatias',kcal:150,protein:6,carbs:26,fat:2,fiber:4,group:'Carboidrato',emoji:'Pão'},
 {id:'xima',name:'Xima',portion:'1 porção',kcal:220,protein:4,carbs:48,fat:1,fiber:2,group:'Carboidrato local',emoji:'Xima'},
 {id:'beans',name:'Feijão cozido',portion:'1 concha',kcal:180,protein:12,carbs:30,fat:1,fiber:10,group:'Proteína e fibra',emoji:'Feijão',image:'/assets/food/feijao-cozido.jpg'},
 {id:'cowpea',name:'Feijão-nhemba',portion:'1 concha',kcal:190,protein:13,carbs:32,fat:1,fiber:9,group:'Proteína e fibra',emoji:'Feijão'},
 {id:'peanut',name:'Amendoim',portion:'25 g',kcal:145,protein:6,carbs:5,fat:12,fiber:2,group:'Gordura e proteína',emoji:'Amendoim',image:'https://images.unsplash.com/photo-1567892737950-30c4db37cd89?auto=format&fit=crop&w=240&q=80'},
 {id:'avocado',name:'Abacate',portion:'1/2 unidade',kcal:160,protein:2,carbs:8,fat:15,fiber:7,group:'Gordura saudável',emoji:'Abacate',image:'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=240&q=80'},
 {id:'papaya',name:'Papaia',portion:'1 chávena',kcal:60,protein:1,carbs:15,fat:0,fiber:3,group:'Fruta',emoji:'Papaia',image:'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=240&q=80'},
 {id:'orange',name:'Laranja',portion:'1 unidade',kcal:70,protein:1,carbs:18,fat:0,fiber:4,group:'Fruta',emoji:'Laranja'},
 {id:'mango',name:'Manga',portion:'1 chávena',kcal:100,protein:1,carbs:25,fat:1,fiber:3,group:'Fruta',emoji:'Manga'},
 {id:'apple',name:'Maçã',portion:'1 unidade',kcal:95,protein:0,carbs:25,fat:0,fiber:4,group:'Fruta',emoji:'Maçã'},
 {id:'strawberry',name:'Morangos',portion:'1 chávena',kcal:50,protein:1,carbs:12,fat:0,fiber:3,group:'Fruta',emoji:'Morangos'},
 {id:'greens',name:'Couve e tomate',portion:'2 chávenas',kcal:55,protein:3,carbs:10,fat:1,fiber:4,group:'Vegetais',emoji:'Vegetais',image:'https://images.unsplash.com/photo-1512621776951-a57141e2eefd?auto=format&fit=crop&w=240&q=80'},
 {id:'broccoli',name:'Couve e tomate',portion:'1 chávena',kcal:55,protein:4,carbs:11,fat:1,fiber:5,group:'Vegetais',emoji:'Couve e tomate'},
 {id:'pumpkin',name:'Abóbora',portion:'1 chávena',kcal:50,protein:2,carbs:12,fat:0,fiber:3,group:'Vegetais',emoji:'Abóbora'},
 {id:'matapa',name:'Matapa',portion:'1 porção',kcal:260,protein:8,carbs:12,fat:20,fiber:6,group:'Prato moçambicano',emoji:'Matapa'},
 {id:'mucapata',name:'Mucapata',portion:'1 porção',kcal:280,protein:9,carbs:45,fat:7,fiber:8,group:'Prato moçambicano',emoji:'Mucapata'},
 {id:'zambeziana',name:'Frango à zambeziana',portion:'1 porção',kcal:300,protein:30,carbs:8,fat:17,fiber:2,group:'Prato moçambicano',emoji:'Frango'},
 {id:'sardine',name:'Sardinha',portion:'120 g',kcal:210,protein:25,carbs:0,fat:12,fiber:0,group:'Proteína',emoji:'Sardinha'},
 {id:'fish-curry',name:'Caril de peixe',portion:'1 porção',kcal:260,protein:28,carbs:10,fat:12,fiber:3,group:'Prato moçambicano',emoji:'Peixe'}
];
const byName=Object.fromEntries(foodLibrary.map(food=>[food.name,food]));
export const supplementCatalog=[{id:'npl-creatine-monohydrate',brand:'NPL',name:'Creatine Monohydrate',format:'150 g ou 500 g',image:'/assets/supplements/npl-creatine-monohydrate.png',url:'https://www.npl.za.com/collections/creatines/products/creatine-monohydrate',whatsapp:'https://wa.me/258868787572?text=Ol%C3%A1!%20Gostaria%20de%20saber%20o%20pre%C3%A7o%2C%20disponibilidade%20e%20entrega%20da%20NPL%20Creatine%20Monohydrate.'}];
const menu30=[
 [['Aveia','Banana','Leite','Ovos'],['Iogurte natural','Papaia'],['Arroz cozido','Frango grelhado','Couve e tomate'],['Peixe grelhado','Batata-doce','Couve e tomate']],
 [['Ovos','Queijo fresco','Pão integral'],['Banana','Amendoim'],['Massa integral','Frango grelhado','Couve e tomate'],['Carne magra','Arroz cozido','Couve e tomate']],
 [['Aveia','Banana','Ovos'],['Iogurte natural','Laranja'],['Arroz cozido','Feijão cozido','Peixe grelhado'],['Frango grelhado','Mandioca','Couve e tomate']],
 [['Pão integral','Ovos','Papaia'],['Queijo fresco','Maçã'],['Mucapata','Peixe grelhado','Couve e tomate'],['Carne magra','Batata-doce','Couve e tomate']],
 [['Aveia','Leite','Manga'],['Banana','Iogurte natural'],['Xima','Matapa','Peixe grelhado'],['Frango grelhado','Arroz cozido','Couve e tomate']],
 [['Batata-doce','Ovos'],['Aveia','Iogurte natural'],['Arroz cozido','Sardinha','Couve e tomate'],['Feijão-nhemba','Frango grelhado','Couve e tomate']],
 [['Ovos','Pão integral','Abacate'],['Papaia','Amendoim'],['Frango à zambeziana','Arroz cozido','Couve e tomate'],['Peixe grelhado','Mandioca','Couve e tomate']],
 [['Iogurte natural','Aveia','Banana'],['Laranja','Queijo fresco'],['Arroz cozido','Carne magra','Couve e tomate'],['Xima','Peixe grelhado','Couve e tomate']],
 [['Ovos','Pão integral','Abacate'],['Manga','Iogurte natural'],['Batata-doce','Frango grelhado','Couve e tomate'],['Arroz cozido','Feijão cozido','Peixe grelhado']],
 [['Aveia','Leite','Banana'],['Banana','Amendoim'],['Massa integral','Carne magra','Couve e tomate'],['Frango grelhado','Mandioca','Couve e tomate']],
 [['Aveia','Ovos','Laranja'],['Iogurte natural','Papaia'],['Arroz cozido','Peixe grelhado','Abóbora'],['Feijão cozido','Batata-doce','Frango grelhado']],
 [['Aveia','Banana','Amendoim'],['Banana','Queijo fresco'],['Mucapata','Frango grelhado','Couve e tomate'],['Peixe grelhado','Arroz cozido','Couve e tomate']],
 [['Batata-doce','Ovos'],['Manga','Iogurte natural'],['Xima','Frango à zambeziana','Couve e tomate'],['Arroz cozido','Feijão cozido','Peixe grelhado']],
 [['Pão integral','Queijo fresco','Maçã'],['Laranja','Amendoim'],['Arroz cozido','Sardinha','Couve e tomate'],['Mandioca','Ovos','Couve e tomate']],
 [['Aveia','Leite','Banana'],['Iogurte natural','Manga'],['Xima','Matapa','Peixe grelhado'],['Frango grelhado','Arroz cozido','Couve e tomate']],
 [['Ovos','Pão integral','Abacate'],['Papaia','Amendoim'],['Arroz cozido','Feijão-nhemba','Peixe grelhado'],['Batata-doce','Frango grelhado','Couve e tomate']],
 [['Iogurte natural','Aveia','Manga'],['Banana','Queijo fresco'],['Mucapata','Peixe grelhado','Couve e tomate'],['Xima','Feijão-nhemba','Couve e tomate']],
 [['Ovos','Pão integral','Laranja'],['Maçã','Amendoim'],['Arroz cozido','Frango grelhado','Abóbora'],['Peixe grelhado','Mandioca','Couve e tomate']],
 [['Batata-doce','Iogurte natural'],['Banana','Ovos'],['Xima','Caril de peixe','Couve e tomate'],['Arroz cozido','Frango grelhado','Couve e tomate']],
 [['Aveia','Banana','Ovos'],['Manga','Iogurte natural'],['Feijão cozido','Arroz cozido','Peixe grelhado'],['Frango grelhado','Batata-doce','Couve e tomate']],
 [['Pão integral','Ovos','Abacate'],['Papaia','Amendoim'],['Frango à zambeziana','Couve e tomate'],['Xima','Peixe grelhado','Couve e tomate']],
 [['Aveia','Leite','Banana'],['Banana','Iogurte natural'],['Arroz cozido','Sardinha','Feijão-nhemba'],['Mandioca','Frango grelhado','Couve e tomate']],
 [['Aveia','Ovos','Manga'],['Laranja','Amendoim'],['Xima','Matapa','Peixe grelhado'],['Arroz cozido','Feijão cozido','Couve e tomate']],
 [['Batata-doce','Ovos'],['Iogurte natural','Manga'],['Arroz cozido','Frango grelhado','Couve e tomate'],['Peixe grelhado','Batata-doce','Couve e tomate']],
 [['Pão integral','Ovos','Papaia'],['Banana','Amendoim'],['Mucapata','Peixe grelhado','Couve e tomate'],['Xima','Frango grelhado','Couve e tomate']],
 [['Aveia','Leite','Banana'],['Maçã','Iogurte natural'],['Arroz cozido','Feijão-nhemba','Frango grelhado'],['Peixe grelhado','Mandioca','Couve e tomate']],
 [['Ovos','Pão integral','Manga'],['Papaia','Amendoim'],['Xima','Caril de peixe','Couve e tomate'],['Arroz cozido','Ovos','Abóbora']],
 [['Aveia','Banana','Manga'],['Iogurte natural','Papaia'],['Frango grelhado','Arroz cozido','Couve e tomate'],['Feijão cozido','Batata-doce','Peixe grelhado']],
 [['Aveia','Ovos','Manga'],['Banana','Iogurte natural'],['Mandioca','Peixe grelhado','Couve e tomate'],['Arroz cozido','Frango grelhado','Couve e tomate']],
 [['Pão integral','Ovos','Papaia'],['Amendoim','Banana'],['Xima','Matapa','Frango à zambeziana'],['Arroz cozido','Feijão cozido','Peixe grelhado']]
];
const labels={emagrecimento:'Emagrecimento',definicao:'Definição (cutting)',bulking:'Bulking (ganho de massa)',musculacao:'Musculação normal / manutenção',condicionamento:'Alimentação equilibrada'};
const objectives={emagrecimento:{calorie:-300,portion:.88,protein:1.8},definicao:{calorie:-250,portion:.9,protein:2},bulking:{calorie:300,portion:1.15,protein:1.8},musculacao:{calorie:0,portion:1,protein:1.6},condicionamento:{calorie:0,portion:1,protein:1.4}};
const modalAdjust={corrida:120,cardio:120,natacao:100,futsal:140,karate:100,bodybuilding:150,musculacao:40};
function ageFrom(profile){if(profile.birth_date){const d=new Date(profile.birth_date),now=new Date();let age=now.getFullYear()-d.getFullYear();if(now<new Date(now.getFullYear(),d.getMonth(),d.getDate()))age--;return age}return Number(profile.age)||null}
function complete(profile){return Number(profile.current_weight)>0&&Number(profile.height)>0&&ageFrom(profile)>=12}
function activityFactor(profile){return {sedentary:1.2,light:1.35,moderate:1.5,active:1.65,very_active:1.8}[profile.daily_activity]||({beginner:1.35,intermediate:1.5,advanced:1.65}[profile.training_level]||1.35)}
function scaleFood(food,scale){return {...food,kcal:Math.round(food.kcal*scale),protein:Math.round(food.protein*scale*10)/10,carbs:Math.round(food.carbs*scale*10)/10,fat:Math.round(food.fat*scale*10)/10,fiber:Math.round(food.fiber*scale*10)/10}}
function hydration(profile,calories){const weight=Number(profile.current_weight)||0,age=ageFrom(profile)||0,activity=activityFactor(profile),duration=Number(profile.training_duration)||45,intensity=profile.training_intensity||'moderate',heat=Number(profile.heat_level)||0;let ml=weight*30+(activity-1.2)*weight*12+Math.max(0,duration-30)*5+heat*200+(intensity==='hard'?250:0);if(age>=65)ml*=.95;return Math.round(Math.max(0,ml+calories*.2))}
export function nutritionPlan(profile={}){
 const age=ageFrom(profile), modality=modalityKeyFor(profile), objective=objectives[modality]||objectives.condicionamento;
 if(!complete(profile))return {incomplete:true,modalityLabel:labels[modality]||labels.condicionamento,message:'Complete idade/data de nascimento, peso e altura no Perfil para calcular o seu plano.',meals:[],dayNumber:1,calories:null,waterMl:null};
 const weight=Number(profile.current_weight),height=Number(profile.height),sex=String(profile.sex||'').toLowerCase();
 const bmr=10*weight+6.25*height-5*age+(sex.includes('fem')?-161:sex.includes('masc')?5:0);const base=bmr*activityFactor(profile)+(modalAdjust[String(profile.modality||'').toLowerCase()]||0);const calories=Math.max(age<18?Math.round(base):1400,Math.round(base+objective.calorie+(profile.training_intensity==='hard'?120:profile.training_intensity==='easy'?-80:0)));
 const dayNumber=Math.min(30,Math.max(1,Number(profile.nutrition_day)||1)), day=menu30[dayNumber-1], training=String(profile.training_time||'18:00').slice(0,5),[h,m]=training.split(':').map(Number);const shift=offset=>{const d=new Date();d.setHours(Number(h)||18,(Number(m)||0)+offset,0,0);return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})};
 const ageNote=age<18?'Para menores de 18 anos: plano equilibrado, sem défice automático ou recomendações de doses de suplementos. Procure um profissional qualificado.':age>=65?'Priorize hidratação, mastigação confortável e avaliação individual quando necessário.':'';
 const preferred=String(profile.available_foods||'').split(',').map(value=>value.trim()).filter(name=>byName[name]);const allergy=String(profile.allergies||profile.dietary_restrictions||'').toLowerCase();const adaptItems=items=>items.map(name=>{const original=byName[name];if(!original)return name;if(allergy&&allergy!=='nenhuma'&&allergy.split(/[,;]+/).some(term=>term.trim()&&name.toLowerCase().includes(term.trim())))return preferred.find(value=>byName[value]?.group===original.group)||name;return preferred.length&&!preferred.includes(name)?(preferred.find(value=>byName[value]?.group===original.group)||name):name});
 const targetScale=objective.portion*(calories/(base||calories));const titles=['Pequeno-almoço','Almoço','Lanche / pré-treino','Jantar'];const offsets=[-480,-180,-75,180];
 const meals=day.map((items,index)=>{const foods=adaptItems(items).map(name=>byName[name]).filter(Boolean).map(food=>scaleFood(food,targetScale));const sum=key=>Math.round(foods.reduce((a,f)=>a+(f[key]||0),0));return {time:shift(offsets[index]),title:titles[index],items:foods.map(f=>f.name),foods,note:index===2?'Ajuste ao horário e tolerância; não faça uma refeição pesada imediatamente antes de correr.':preferred.length?'Priorizamos alimentos que indicou como acessíveis e habituais.':'Combine proteína, carboidrato e alimentos locais conforme o seu objetivo.',kcal:sum('kcal'),protein:sum('protein'),carbs:sum('carbs'),fat:sum('fat'),fiber:sum('fiber'),recipe:index===0?'Cozinhe ou misture sem fritura; ajuste a textura e a porção.':index===1?'Prepare com pouco óleo e mantenha vegetais no prato.':'Prepare de forma simples, com água suficiente e sem substituir refeição por suplemento.'}});
 const pre={time:shift(-75),title:'Pré-treino',items:['Banana'],foods:[scaleFood(byName.Banana,targetScale)],note:'Opção leve quando necessário; ajuste à digestão e à duração do treino.',kcal:Math.round(105*targetScale),protein:Math.round(targetScale),carbs:Math.round(27*targetScale),fat:0,fiber:Math.round(3*targetScale),recipe:'Consuma apenas se tolerado.'};const post={time:shift(75),title:'Pós-treino',items:['Iogurte natural','Banana'],foods:[scaleFood(byName['Iogurte natural'],targetScale),scaleFood(byName.Banana,targetScale)],note:'Proteína e carboidrato podem ser obtidos por alimentos comuns; whey é opcional.',kcal:Math.round(215*targetScale),protein:Math.round(10*targetScale),carbs:Math.round(39*targetScale),fat:Math.round(3*targetScale),fiber:Math.round(3*targetScale),recipe:'Misture ou consuma separadamente.'};
 const finalMeals=[meals[0],meals[1],pre,post,meals[2],meals[3]];return {incomplete:false,dayNumber,calories,bmr:Math.round(bmr),waterMl:hydration(profile,calories),meals:finalMeals,training,modalityLabel:labels[modality]||labels.condicionamento,modalityNote:ageNote||'Estimativa ajustada ao seu objetivo, atividade, modalidade e intensidade.',proteinTarget:Math.round(weight*objective.protein),carbsTarget:Math.round(calories*.45/4),fatTarget:Math.round(calories*.3/9),fiberTarget:Math.round(Math.max(25,calories/1000*14)),budgetNote:profile.food_budget==='low'?'Priorize feijão, ovos, aveia, arroz, hortaliças da época e peixe local; compare preços e use substituições.':'Combine alimentos locais e internacionais conforme disponibilidade e orçamento.',eligibleForSupplement:age>=18,creatine:age<18?'Suplementos não são recomendados automaticamente para menores. Converse com um profissional.':'Creatina monohidratada é opcional. A referência informativa frequentemente estudada para adultos saudáveis é 3–5 g/dia, sem calcular dose pelo peso e sem substituir avaliação profissional.'};
}
export function estimateWorkoutKcal(profile={},minutes=35,intensity='moderate'){const weight=Number(profile.current_weight)||0;if(!weight)return 0;const met=intensity==='hard'?8:intensity==='easy'?3.5:5.5;return Math.round(met*3.5*weight/200*minutes)}
export function foodSubstitutions(name){const groups={frango:['Peixe grelhado','Ovos','Feijão cozido'],peixe:['Frango grelhado','Ovos','Sardinha'],arroz:['Batata-doce','Mandioca','Xima'],iogurte:['Leite','Queijo fresco'],fruta:['Banana','Papaia','Laranja','Maçã']};const key=String(name).toLowerCase();return Object.entries(groups).find(([group])=>key.includes(group))?.[1]||[]}
