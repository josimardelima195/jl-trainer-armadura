const labels = {
  bodyweight: 'Sem equipamento',
  barbell: 'Barra',
  dumbbell: 'Halteres',
  cable: 'Cabo',
  machine: 'Máquina',
  'leverage machine': 'Máquina',
  kettlebell: 'Kettlebell',
  'resistance band': 'Elástico',
  band: 'Elástico',
  assisted: 'Assistido',
  'smith machine': 'Smith',
  'EZ bar': 'Barra EZ',
  rope: 'Corda',
  roller: 'Rolo',
  'ab wheel': 'Roda abdominal',
  'olympic barbell': 'Barra olímpica',
  'trap bar': 'Barra hexagonal',
  'stability ball': 'Bola suíça',
  'medicine ball': 'Bola medicinal',
  'stepmill machine': 'Escada',
  tire: 'Pneu',
  'sled machine': 'Trenó',
  'suspension trainer': 'Suspensão',
  weighted: 'Carga adicional'
};

const body = {
  back: 'Costas',
  cardio: 'Cardio',
  chest: 'Peito',
  'lower arms': 'Antebraços',
  'lower legs': 'Panturrilhas',
  neck: 'Pescoço',
  shoulders: 'Ombros',
  'upper arms': 'Braços',
  'upper legs': 'Pernas',
  waist: 'Abdômen'
};

const title = value => String(value || '').replace(/\b\w/g, character => character.toUpperCase());

export function normalizeExercise(exercise) {
  const rawEquipment = Array.isArray(exercise.equipments) ? exercise.equipments : [];
  const isBodyweightOnly = rawEquipment.length > 0 && rawEquipment.every(item => String(item).toLowerCase() === 'bodyweight');
  const equipment = isBodyweightOnly
    ? 'Sem equipamento'
    : rawEquipment.map(value => labels[value] || title(value)).join(', ') || 'Com equipamento';
  const primaryMuscles = exercise.targetMuscles || [];
  const secondaryMuscles = exercise.secondaryMuscles || [];
  const bodyParts = exercise.bodyParts || [];

  return {
    id: `edb-${exercise.exerciseId}`,
    source_id: exercise.exerciseId,
    source: 'ExerciseDB gratuito',
    name: title(exercise.name),
    category: bodyParts[0] ? (body[bodyParts[0]] || title(bodyParts[0])) : 'Condicionamento',
    equipment,
    equipment_mode: isBodyweightOnly ? 'bodyweight' : 'equipment',
    body_parts: bodyParts,
    primary_muscles: primaryMuscles,
    secondary_muscles: secondaryMuscles,
    sets: 3,
    reps: '8–12',
    rest_seconds: 60,
    min_tier: 0,
    image_path: exercise.gifUrl,
    description: `Demonstração de ${title(exercise.name)}. Faça o movimento devagar, com postura controlada e sem dor.`,
    instructions: exercise.instructions || [],
    goal_tags: ['condicionamento'],
    media_license: 'ExerciseDB V1 gratuito — uso não comercial e atribuição obrigatória'
  };
}

export async function loadExerciseDb() {
  const response = await fetch('/exercises/exercisedb.json?v=3');
  if (!response.ok) throw new Error('Biblioteca de exercícios indisponível');
  const list = await response.json();
  return list.map(normalizeExercise);
}
