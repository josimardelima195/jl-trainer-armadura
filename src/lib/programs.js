const goalWords={
 emagrecimento:['cardio','cardiovascular','hiit','jump','burpee','run','mountain','step','rope','jack','sprint'],
 massa:['barbell','dumbbell','cable','machine','press','row','curl','squat','deadlift','lunge','pulldown'],
 musculacao:['barbell','dumbbell','cable','machine','press','row','curl','squat','deadlift','lunge','pulldown'],
 cardio:['cardio','run','jump','burpee','mountain','step','rope','jack','sprint'],
 casa:['bodyweight','push','plank','crunch','sit up','lunge','squat','bridge','stretch'],
 condicionamento:['bodyweight','cardio','push','squat','lunge','plank','row'],
 futsal:['futsal','sprint','agility','lateral','jump','calf','run','lunge','squat','plyometric'],
 karate:['karate','karaté','kick','punch','martial','hip','mobility','plank','lunge'],
 natacao:['swim','stroke','kick','lat','shoulder','core','mobility']
};
const split=['Peito e tríceps','Costas e bíceps','Pernas e glúteos','Cardio e core','Ombros e mobilidade','Corpo inteiro','Recuperação ativa'];
const muscleFilters=[['chest','pectorals','triceps','upper arms','push','press','fly'],['back','latissimus','lats','biceps','row','pull','pulldown','curl'],['upper legs','quadriceps','hamstrings','glutes','glute','calves','squat','lunge','leg'],['cardio','abdominals','waist','core','abs','run','jump','burpee','mountain'],['shoulders','deltoids','traps','mobility','stretch','rotator'],['full body','bodyweight','squat','push','row','lunge']];
const clean=s=>String(s||'').toLowerCase();
function score(e,goal,day){
 const text=clean(`${e.name} ${e.category} ${e.primary_muscles?.join(' ')} ${e.secondary_muscles?.join(' ')} ${e.equipment}`);let n=0;
 if((goalWords[goal]||goalWords.condicionamento).some(w=>text.includes(w)))n+=5;
 if((muscleFilters[day%6]||[]).some(w=>text.includes(w)))n+=4;
 if(e.image_path)n+=1;return n;
}
export function build30DayPlan(exercises=[],goal='condicionamento',level='beginner',intensity='moderate',equipment=''){
 const equipmentText=clean(equipment);const safe=exercises.filter(e=>e?.image_path&&(!equipmentText||equipmentText==='todos'||(equipmentText.includes('sem')?clean(e.equipment)==='sem equipamento':clean(e.equipment)!=='sem equipamento')));const counts={easy:4,moderate:6,hard:8};const count=counts[intensity]||6;
 return Array.from({length:30},(_,i)=>{const day=i+1,rest=day%7===0;const ordered=[...safe].sort((a,b)=>score(b,goal,day)-score(a,goal,day)||String(a.name).localeCompare(String(b.name)));const preferred=ordered.filter(e=>score(e,goal,day)>4),pool=preferred.length>=Math.min(count,3)?preferred:ordered;const selected=rest?pool.slice(0,2):pool.slice((i*3)%Math.max(1,pool.length-count),((i*3)%Math.max(1,pool.length-count))+count);return {day,title:rest?'Recuperação ativa':`Dia ${day} · ${split[i%split.length]}`,focus:rest?'Mobilidade, caminhada leve e respiração':split[i%split.length],level,intensity,rest,exercises:selected.map((e,j)=>({...e,sets:intensity==='hard'?4:intensity==='easy'?2:3,reps:intensity==='hard'?'10–15':intensity==='easy'?'8–10':'8–12',day_number:day,sort_order:j}))};});
}
export const intensityLabels={easy:'Fácil',moderate:'Médio',hard:'Difícil'};
