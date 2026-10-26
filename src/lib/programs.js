const clean = value => String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const goalWords = {
  emagrecimento: ['cardio','cardiovascular','hiit','jump','burpee','run','running','mountain','step','rope','jack','sprint','treadmill','jog'],
  definicao: ['cardio','hiit','jump','burpee','run','running','mountain','step','rope','jack','sprint','treadmill','press','row','curl'],
  bulking: ['barbell','dumbbell','cable','machine','press','row','curl','squat','deadlift','lunge','pulldown'],
  massa: ['barbell','dumbbell','cable','machine','press','row','curl','squat','deadlift','lunge','pulldown'],
  musculacao: ['barbell','dumbbell','cable','machine','press','row','curl','squat','deadlift','lunge','pulldown'],
  cardio: ['cardio','run','running','jump','burpee','mountain','step','rope','jack','sprint'],
  casa: ['bodyweight','push','plank','crunch','sit up','lunge','squat','bridge','stretch'],
  condicionamento: ['bodyweight','cardio','push','squat','lunge','plank','row'],
  futsal: ['sprint','agility','lateral','jump','calf','run','lunge','squat','plyometric'],
  karate: ['kick','punch','martial','hip','mobility','plank','lunge'],
  natacao: ['swim','stroke','kick','lat','shoulder','core','mobility']
};

const aliases = {
  chest: ['chest','pectorals','peito','peitoral'],
  triceps: ['triceps','tricep'],
  back: ['back','upper back','latissimus dorsi','lats','erector spinae','trapezius','costas'],
  biceps: ['biceps','bicep','brachialis','bracos'],
  legs: ['upper legs','lower legs','quadriceps','hamstrings','calves','adductors','abductors','pernas','posterior'],
  glutes: ['glutes','gluteus','gluteos','gluteo','hamstrings','posterior'],
  cardio: ['cardiovascular system','cardio','cardiovascular','resistencia'],
  core: ['abdominals','abdominal','obliques','core','waist','abdomen','abdominais'],
  shoulders: ['shoulders','deltoids','trapezius','traps','rotator cuff','ombros'],
  mobility: ['mobility','stretch','flexibility','mobilidade','alongamento']
};

const daySplit = [
  {key:'chest_triceps',label:'Peito e tríceps',groups:['chest','triceps']},
  {key:'back_biceps',label:'Costas e bíceps',groups:['back','biceps']},
  {key:'legs_glutes',label:'Pernas e glúteos',groups:['legs','glutes']},
  {key:'cardio_core',label:'Cardio e abdômen',groups:['cardio','core']},
  {key:'shoulders_mobility',label:'Ombros e mobilidade',groups:['shoulders','mobility']},
  {key:'full_body',label:'Corpo inteiro',groups:['chest','back','legs','core']},
  {key:'recovery',label:'Recuperação ativa',groups:['mobility','cardio']}
];

const modalitySchedules = {
  emagrecimento: ['cardio_core','legs_glutes','full_body','cardio_core','back_biceps','cardio_core','recovery'],
  definicao: ['cardio_core','chest_triceps','back_biceps','legs_glutes','cardio_core','full_body','recovery'],
  bulking: ['chest_triceps','back_biceps','legs_glutes','shoulders_mobility','legs_glutes','full_body','recovery'],
  musculacao: ['chest_triceps','back_biceps','legs_glutes','shoulders_mobility','full_body','cardio_core','recovery'],
  massa: ['chest_triceps','back_biceps','legs_glutes','shoulders_mobility','legs_glutes','full_body','recovery'],
  casa: ['chest_triceps','legs_glutes','back_biceps','cardio_core','shoulders_mobility','full_body','recovery'],
  condicionamento: ['chest_triceps','back_biceps','legs_glutes','cardio_core','shoulders_mobility','full_body','recovery']
};
const runningDays = new Set([1,4,8,11,15,18,22,25,29]);
const recoveryWords = ['stretch','mobility','flexibility','yoga','pose','rotation','walk','walking','march','breath','alongamento','mobilidade','caminhada'];
const bodyweightValues = ['bodyweight','peso corporal','sem equipamento','sem equipamentos'];

export function modalityKeyFor(value) {
  const text = clean(typeof value === 'object' ? `${value?.modality || ''} ${value?.goal || ''}` : value);
  if (text.includes('emag')) return 'emagrecimento';
  if (text.includes('defini') || text.includes('cut')) return 'definicao';
  if (text.includes('bulking')) return 'bulking';
  if (text.includes('muscul')) return 'musculacao';
  if (text.includes('massa')) return 'massa';
  if (text.includes('casa')) return 'casa';
  if (text.includes('futsal')) return 'futsal';
  if (text.includes('karat')) return 'karate';
  if (text.includes('nata')) return 'natacao';
  return 'condicionamento';
}

function textFor(e) { return clean([e?.name,e?.category,...(e?.primary_muscles || e?.target_muscles || []),...(e?.secondary_muscles || []),...(e?.body_parts || []),e?.equipment,e?.equipment_mode].join(' ')); }
function primaryTextFor(e) { const primary=e?.primary_muscles || e?.target_muscles; return clean((primary?.length ? primary : [e?.category,e?.name,...(e?.body_parts || [])]).join(' ')); }
function containsAlias(text,group) { return (aliases[group] || []).some(alias => clean(text).includes(clean(alias))); }
function primaryHasGroup(e,group) { return containsAlias(primaryTextFor(e),group); }
function hasGroup(e,group) { return primaryHasGroup(e,group) || containsAlias(textFor(e),group); }

export function exerciseEquipmentMode(e) {
  const explicit=clean(e?.equipment_mode);
  if (explicit === 'bodyweight' || explicit === 'equipment') return explicit;
  return bodyweightValues.some(value => clean(e?.equipment).includes(value)) ? 'bodyweight' : 'equipment';
}
export function normalizeEquipmentSelection(value) {
  const text=clean(value);
  if (!text || text === 'todos' || text === 'all') return 'all';
  if (text.includes('sem') || text.includes('casa') || text === 'bodyweight') return 'bodyweight';
  if (text.includes('com') || text.includes('ginasio') || text.includes('academia') || text === 'equipment') return 'equipment';
  return 'all';
}

export function exerciseMatchesFocus(e,focusKey) {
  if (!e) return false;
  if (focusKey === 'recovery') return recoveryWords.some(word => textFor(e).includes(clean(word))) || hasGroup(e,'mobility');
  if (focusKey === 'full_body') return ['chest','back','legs','core','shoulders'].some(group => hasGroup(e,group));
  const focus=daySplit.find(item => item.key === focusKey);
  return Boolean(focus?.groups.some(group => primaryHasGroup(e,group)));
}
function focusScore(e,focusKey) {
  if (focusKey === 'recovery') return recoveryWords.reduce((score,word) => score + (textFor(e).includes(clean(word)) ? 3 : 0),0);
  const focus=daySplit.find(item => item.key === focusKey);
  return (focus?.groups || []).reduce((score,group) => score + (primaryHasGroup(e,group) ? 8 : hasGroup(e,group) ? 2 : 0),0);
}
function goalScore(e,goal) { const text=textFor(e); return (goalWords[goal] || goalWords.condicionamento).reduce((score,word) => score + (text.includes(clean(word)) ? 1 : 0),0); }
function uniqueExercises(exercises) {
  const seen=new Set();
  return exercises.filter(e => { const key=`${clean(e?.name)}|${exerciseEquipmentMode(e)}`; if (!key || seen.has(key)) return false; seen.add(key); return true; });
}
function rankedForDay(exercises,focusKey,goal,day) {
  return [...exercises].sort((a,b) => { const scoreA=focusScore(a,focusKey)*100+goalScore(a,goal)*3+(a.image_path ? 1 : 0); const scoreB=focusScore(b,focusKey)*100+goalScore(b,goal)*3+(b.image_path ? 1 : 0); return scoreB-scoreA || String(a.name || '').localeCompare(String(b.name || ''),'pt-BR'); }).map((exercise,index,list) => list[(index+((day-1)*2))%list.length]);
}
function rotatePick(list,count,day) { if (!list.length) return []; if (list.length <= count) return list; const start=((day-1)*2)%list.length; return Array.from({length:count},(_,index) => list[(start+index)%list.length]); }

export function focusForDay(day,goal='condicionamento') {
  const schedule=modalitySchedules[modalityKeyFor(goal)] || modalitySchedules.condicionamento;
  const key=schedule[(Math.max(1,Number(day) || 1)-1)%schedule.length];
  return daySplit.find(item => item.key === key) || daySplit[0];
}
export function build30DayPlan(exercises=[],goal='condicionamento',level='beginner',intensity='moderate',equipment='') {
  const requestedMode=normalizeEquipmentSelection(equipment);
  const counts={easy:5,moderate:6,hard:8};
  const requestedCount=counts[intensity] || counts.moderate;
  const modality=modalityKeyFor(goal);
  const source=uniqueExercises(exercises).filter(e => e?.image_path || e?.gifUrl);
  const filtered=source.filter(e => requestedMode === 'all' || exerciseEquipmentMode(e) === requestedMode);
  return Array.from({length:30},(_,index) => {
    const day=index+1, focus=focusForDay(day,modality), isRecovery=focus.key === 'recovery';
    const exact=filtered.filter(e => exerciseMatchesFocus(e,focus.key));
    const ranked=rankedForDay(exact,focus.key,modality,day);
    const selected=rotatePick(ranked,isRecovery ? Math.min(3,ranked.length) : requestedCount,day);
    const isRunDay=modality === 'emagrecimento' && runningDays.has(day);
    return {day,title:`Dia ${day} · ${focus.label}`,focus:focus.label,focus_key:focus.key,groups:focus.groups,level,intensity,rest:isRecovery,equipment_mode:requestedMode,isRunDay,sessionLabel:isRunDay?'Corrida guiada · meta de 4 km':'Treino específico da modalidade',exercises:selected.map((e,order) => ({...e,sets:isRecovery ? 2 : intensity === 'hard' ? 4 : intensity === 'easy' ? 2 : 3,reps:isRecovery ? '20–30 min' : intensity === 'hard' ? '10–15' : intensity === 'easy' ? '8–10' : '8–12',day_number:day,sort_order:order}))};
  });
}

export const intensityLabels={easy:'Fácil',moderate:'Médio',hard:'Difícil'};
export const intensityNotes={easy:'Volume reduzido para começar com controle.',moderate:'Volume equilibrado para evoluir com consistência.',hard:'Mais puxado: mais exercícios, séries e repetições. Respeite seus limites.'};
