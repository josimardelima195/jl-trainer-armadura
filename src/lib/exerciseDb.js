const labels={
 bodyweight:'Peso corporal',barbell:'Barra',dumbbell:'Halteres',cable:'Cabo',machine:'Máquina',kettlebell:'Kettlebell',band:'Elástico',assisted:'Assistido',leverage_machine:'Máquina',smith_machine:'Smith',ez_barbell:'Barra EZ',rope:'Corda',wheel_roller:'Roda abdominal',olympic_barbell:'Barra olímpica',trap_bar:'Barra hexagonal',bosu_ball:'Bosu',stability_ball:'Bola suíça',stepmill_machine:'Escada',tire:'Pneu',sled_machine:'Trenó'
};
const body={back:'Costas',cardio:'Cardio',chest:'Peito','lower arms':'Antebraços','lower legs':'Panturrilhas',neck:'Pescoço',shoulders:'Ombros','upper arms':'Braços','upper legs':'Pernas',waist:'Abdómen'};
const title=s=>String(s||'').replace(/\b\w/g,c=>c.toUpperCase());
export function normalizeExercise(x){
 const equipment=(x.equipments||[]).map(v=>labels[v]||title(v)).join(', ')||'Sem equipamento';
 const category=body[x.bodyParts?.[0]]||title(x.bodyParts?.[0]||'Condicionamento');
 return {id:`edb-${x.exerciseId}`,source_id:x.exerciseId,source:'ExerciseDB gratuito',name:title(x.name),category,equipment,sets:3,reps:'8–12',rest_seconds:60,min_tier:0,image_path:x.gifUrl,description:`Demonstração de ${title(x.name)}. Faça o movimento devagar, com postura controlada e sem dor.`,instructions:x.instructions||[],primary_muscles:x.targetMuscles||[],secondary_muscles:x.secondaryMuscles||[],goal_tags:['condicionamento'],media_license:'ExerciseDB V1 gratuito — uso não comercial e atribuição obrigatória'};
}
export async function loadExerciseDb(){
 const r=await fetch('/exercises/exercisedb.json');
 if(!r.ok)throw new Error('Biblioteca de exercícios indisponível');
 const list=await r.json();return list.map(normalizeExercise);
}
