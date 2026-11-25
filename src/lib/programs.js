const clean = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const goalWords = {
  emagrecimento: [
    "cardio",
    "cardiovascular",
    "hiit",
    "jump",
    "burpee",
    "run",
    "running",
    "mountain",
    "step",
    "rope",
    "jack",
    "sprint",
    "treadmill",
    "jog",
  ],
  definicao: [
    "cardio",
    "hiit",
    "jump",
    "burpee",
    "run",
    "running",
    "mountain",
    "step",
    "rope",
    "jack",
    "sprint",
    "treadmill",
    "press",
    "row",
    "curl",
  ],
  bulking: [
    "barbell",
    "dumbbell",
    "cable",
    "machine",
    "press",
    "row",
    "curl",
    "squat",
    "deadlift",
    "lunge",
    "pulldown",
  ],
  massa: [
    "barbell",
    "dumbbell",
    "cable",
    "machine",
    "press",
    "row",
    "curl",
    "squat",
    "deadlift",
    "lunge",
    "pulldown",
  ],
  musculacao: [
    "barbell",
    "dumbbell",
    "cable",
    "machine",
    "press",
    "row",
    "curl",
    "squat",
    "deadlift",
    "lunge",
    "pulldown",
  ],
  cardio: [
    "cardio",
    "run",
    "running",
    "jump",
    "burpee",
    "mountain",
    "step",
    "rope",
    "jack",
    "sprint",
  ],
  casa: [
    "bodyweight",
    "push",
    "plank",
    "crunch",
    "sit up",
    "lunge",
    "squat",
    "bridge",
    "stretch",
  ],
  condicionamento: [
    "bodyweight",
    "cardio",
    "push",
    "squat",
    "lunge",
    "plank",
    "row",
  ],
  calistenia: ["push", "pull", "bodyweight", "plank", "dip", "hollow", "scapula", "handstand"],
};

const aliases = {
  chest: ["chest", "pectorals", "peito", "peitoral"],
  triceps: ["triceps", "tricep"],
  back: [
    "back",
    "upper back",
    "latissimus dorsi",
    "lats",
    "erector spinae",
    "trapezius",
    "costas",
  ],
  biceps: ["biceps", "bicep", "brachialis", "bracos"],
  legs: [
    "upper legs",
    "lower legs",
    "quadriceps",
    "hamstrings",
    "calves",
    "adductors",
    "abductors",
    "pernas",
    "posterior",
  ],
  glutes: ["glutes", "gluteus", "gluteos", "gluteo", "hamstrings", "posterior"],
  cardio: ["cardiovascular system", "cardio", "cardiovascular", "resistencia"],
  core: [
    "abdominals",
    "abdominal",
    "obliques",
    "core",
    "waist",
    "abdomen",
    "abdominais",
  ],
  shoulders: [
    "shoulders",
    "deltoids",
    "trapezius",
    "traps",
    "rotator cuff",
    "ombros",
  ],
  mobility: ["mobility", "stretch", "flexibility", "mobilidade", "alongamento"],
};

const daySplit = [
  {
    key: "chest_triceps",
    label: "Peito e tríceps",
    groups: ["chest", "triceps"],
  },
  { key: "back_biceps", label: "Costas e bíceps", groups: ["back", "biceps"] },
  { key: "legs_glutes", label: "Pernas e glúteos", groups: ["legs", "glutes"] },
  { key: "cardio_core", label: "Cardio e abdômen", groups: ["cardio", "core"] },
  {
    key: "shoulders_mobility",
    label: "Ombros e mobilidade",
    groups: ["shoulders", "mobility"],
  },
  {
    key: "full_body",
    label: "Corpo inteiro",
    groups: ["chest", "back", "legs", "core"],
  },
  {
    key: "recovery",
    label: "Recuperação ativa",
    groups: ["mobility", "cardio"],
  },
];

const modalitySchedules = {
  emagrecimento: [
    "cardio_core",
    "legs_glutes",
    "full_body",
    "cardio_core",
    "back_biceps",
    "cardio_core",
    "recovery",
  ],
  definicao: [
    "cardio_core",
    "chest_triceps",
    "back_biceps",
    "legs_glutes",
    "cardio_core",
    "full_body",
    "recovery",
  ],
  bulking: [
    "chest_triceps",
    "back_biceps",
    "legs_glutes",
    "shoulders_mobility",
    "cardio_core",
    "full_body",
    "recovery",
  ],
  musculacao: [
    "chest_triceps",
    "back_biceps",
    "legs_glutes",
    "shoulders_mobility",
    "cardio_core",
    "full_body",
    "recovery",
  ],
  massa: [
    "chest_triceps",
    "back_biceps",
    "legs_glutes",
    "shoulders_mobility",
    "legs_glutes",
    "full_body",
    "recovery",
  ],
  casa: [
    "chest_triceps",
    "legs_glutes",
    "back_biceps",
    "cardio_core",
    "shoulders_mobility",
    "full_body",
    "recovery",
  ],
  condicionamento: [
    "chest_triceps",
    "back_biceps",
    "legs_glutes",
    "cardio_core",
    "shoulders_mobility",
    "full_body",
    "recovery",
  ],
  calistenia: ["chest_triceps", "back_biceps", "legs_glutes", "shoulders_mobility", "cardio_core", "full_body", "recovery"],
  boxe: ["cardio_core", "chest_triceps", "legs_glutes", "cardio_core", "full_body", "shoulders_mobility", "recovery"],
  karate: ["full_body", "legs_glutes", "shoulders_mobility", "cardio_core", "full_body", "legs_glutes", "recovery"],
};
function trainingDaysForCount(count) {
  const schedules = {
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 6],
    5: [1, 2, 3, 5, 6],
    6: [1, 2, 3, 4, 5, 6],
  };
  return new Set(schedules[Math.min(6, Math.max(2, Number(count) || 3))] || schedules[3]);
}
const runningDays = new Set([1, 4, 8, 11, 15, 18, 22, 25, 29]);
const recoveryWords = [
  "stretch",
  "mobility",
  "flexibility",
  "yoga",
  "pose",
  "rotation",
  "walk",
  "walking",
  "march",
  "breath",
  "alongamento",
  "mobilidade",
  "caminhada",
];
const bodyweightValues = [
  "bodyweight",
  "peso corporal",
  "sem equipamento",
  "sem equipamentos",
];
const higherSkillWords = [
  "front lever",
  "muscle up",
  "handstand",
  "clap",
  "pistol",
  "human flag",
  "planche",
  "frog stand",
  "l-sit",
  "jump squat",
  "box jump",
  "burpee",
  "sprint",
];
const excludedExercisePattern = /\b(?:swing\s*360|front lever|muscle up|handstand|clap|pistol|human flag|planche|frog stand|l sit|suspend row|bar spin|release catch|backflip|frontflip|kip up|aerial|snatch|clean and jerk|power clean|one rep max|1rm|maximal lift|maximum load)\b/;
const highImpactExercisePattern = /\b(?:jump squat|box jump|depth jump|burpee|sprint|wind sprint|jumping jacks?|jack jump|high knees|skater hops|jump rope|pular corda|polichinelos?)\b/;

export function ageFromProfile(profile = {}) {
  if (profile.birth_date) {
    const birth = new Date(`${profile.birth_date}T12:00:00`),
      now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()))
      age--;
    return age;
  }
  return Number(profile.age) || 30;
}

export function isTimedExercise(exercise = {}) {
  const name = clean(exercise?.name);
  const category = clean(exercise?.category);
  const bodyParts = (exercise?.body_parts || exercise?.bodyParts || []).map(clean);
  const muscles = (exercise?.primary_muscles || exercise?.targetMuscles || exercise?.target_muscles || []).map(clean);
  const equipment = clean(exercise?.equipment);
  const reps = clean(exercise?.reps);

  if (Number(exercise?.duration_seconds || exercise?.work_seconds || exercise?.duration_minutes) > 0) return true;
  if (bodyParts.some((part) => part.includes("cardio")) || category.includes("cardio") || muscles.includes("cardiovascular system")) return true;

  const continuousMovement = /\b(?:stationary bike|stationary bicycle|exercise bike|hands bike|bike|bicicleta ergonometrica|bicicleta estacionaria|cycling|cycle cross trainer|elliptical|stepmill|treadmill|esteira|running|run|jog|corrida|correr|jump rope|jack jump|star jump|jumping jacks?|polichinelos?|pular corda|high knees|mountain climbers?|bear crawl|burpees?|skater hops|battling ropes|march in place|marcha no lugar|caminhada|walking|sprints?|wind sprints?)\b/.test(name);
  if (continuousMovement) return true;
  if (/\bfarmer(?:s)? walk\b/.test(name) || /\b\d+\s*(?:m|metros)\b/.test(reps)) return false;

  if (/stationary bike|elliptical machine|stepmill machine|treadmill|upper body ergometer/.test(equipment)) return true;

  const staticHold = /\b(?:plank|prancha|hollow hold|wall sit|l[- ]?sit|dead hang|isometric|hold|frog stand|planche|front lever)\b/.test(name);
  const dynamicVariation = /\b(?:tap|shoulder tap|hip abduction|push[- ]?up|rear fly|crunch|jackknife)\b/.test(name);
  if (staticHold && !dynamicVariation) return true;

  return /\d+\s*(?:[-–]\s*\d+\s*)?(?:s|secs?|seconds?|seg(?:undo|undos)?|min|mins?|minutes?|minutos?)\b/.test(reps);
}

function timeRangeFromPrescription(value) {
  const text = clean(value).replace(/,/g, ".");
  const range = text.match(/(\d+)\s*(?:-|–|a)\s*(\d+)\s*(s|secs?|seconds?|seg(?:undo|undos)?|min|mins?|minutes?|minutos?)(?:\b|$)/);
  if (range) return { min: Number(range[1]), max: Number(range[2]), unit: range[3] };
  const single = text.match(/(\d+)\s*(s|secs?|seconds?|seg(?:undo|undos)?|min|mins?|minutes?|minutos?)(?:\b|$)/);
  if (single) return { min: Number(single[1]), max: Number(single[1]), unit: single[2] };
  return null;
}

export function exerciseDurationSeconds(exercise = {}, profile = {}, intensity = "moderate") {
  const age = ageFromProfile(profile);
  const level = clean(profile.training_level || "beginner");
  const name = clean(exercise?.name);
  const explicitSeconds = Number(exercise?.duration_seconds || exercise?.work_seconds);
  const explicitMinutes = Number(exercise?.duration_minutes);
  if (explicitSeconds > 0) return explicitSeconds;
  if (explicitMinutes > 0) return Math.round(explicitMinutes * 60);
  const isHold = /\b(?:plank|prancha|hollow hold|wall sit|l[- ]?sit|dead hang|isometric|hold|frog stand|planche|front lever)\b/.test(name);
  const prescribed = timeRangeFromPrescription(exercise?.reps);
  if (prescribed) {
    const unit = /min/.test(prescribed.unit) ? 60 : 1;
    const beginnerOrOlder = level.includes("beginner") || level.includes("iniciante") || age >= 65;
    const advanced = level.includes("advanced") || level.includes("avancado");
    const chosen = prescribed.min === prescribed.max
      ? prescribed.min
      : beginnerOrOlder || intensity === "easy"
        ? prescribed.min
        : advanced && intensity === "hard" && age < 50
          ? prescribed.max
          : Math.round((prescribed.min + prescribed.max) / 2);
    return Math.max(10, chosen * unit);
  }

  if (isHold) {
    const base = intensity === "hard" ? 40 : intensity === "easy" ? 20 : 30;
    return age >= 65 || level.includes("beginner") || level.includes("iniciante")
      ? Math.min(base, age >= 65 ? 15 : 20)
      : base;
  }

  const highImpact = /\b(?:jump rope|jack jump|semi squat jump|scissor jumps?|astride jumps?|star jump|jumping jacks?|polichinelos?|pular corda|high knees|mountain climbers?|bear crawl|burpees?|skater hops|battling ropes|ski step|sprints?|wind sprints?)\b/.test(name);
  let minutes = highImpact
    ? intensity === "hard" ? 3 : intensity === "easy" ? 1 : 2
    : intensity === "hard" ? 10 : intensity === "easy" ? 5 : 8;
  if (level.includes("beginner") || level.includes("iniciante")) minutes = Math.min(minutes, highImpact ? 1 : 6);
  if (age >= 50) minutes = Math.min(minutes, highImpact ? 2 : 8);
  if (age >= 65) minutes = Math.min(minutes, highImpact ? 1 : 5);
  return minutes * 60;
}

export function modalityKeyFor(value) {
  const text = clean(typeof value === "object" ? value?.modality || "" : value);
  if (text.includes("box") || text.includes("boxing")) return "boxe";
  if (text.includes("karate")) return "karate";
  if (text.includes("calisten")) return "calistenia";
  if (text.includes("casa")) return "casa";
  if (text.includes("muscul") || text.includes("bulking") || text.includes("defini") || text.includes("emagrec") || text.includes("massa")) return "musculacao";
  return "musculacao";
}

export function exerciseGoalKeyFor(value = {}, fallback = "condicionamento") {
  const goal = clean(
    typeof value === "object"
      ? value?.goal || value?.modality || ""
      : value,
  );
  if (goal.includes("emagrec") || goal.includes("perda de peso")) return "emagrecimento";
  if (goal.includes("defini") || goal.includes("cut") || goal.includes("recompos")) return "definicao";
  if (goal.includes("bulking") || goal.includes("ganho") || goal.includes("massa")) return "bulking";
  if (goal.includes("condicion")) return "condicionamento";
  if (goal.includes("manut")) return "condicionamento";
  if (goal.includes("muscul")) return "musculacao";
  return fallback || "condicionamento";
}

function textFor(e) {
  return clean(
    [
      e?.name,
      e?.category,
      ...(e?.primary_muscles || e?.target_muscles || []),
      ...(e?.secondary_muscles || []),
      ...(e?.body_parts || []),
      e?.equipment,
      e?.equipment_mode,
    ].join(" "),
  );
}
function primaryTextFor(e) {
  const primary = e?.primary_muscles || e?.target_muscles;
  return clean(
    (primary?.length
      ? primary
      : [e?.category, e?.name, ...(e?.body_parts || [])]
    ).join(" "),
  );
}
function containsAlias(text, group) {
  return (aliases[group] || []).some((alias) =>
    clean(text).includes(clean(alias)),
  );
}
function primaryHasGroup(e, group) {
  return containsAlias(primaryTextFor(e), group);
}
function hasGroup(e, group) {
  return primaryHasGroup(e, group) || containsAlias(textFor(e), group);
}

export function primaryMuscleKey(exercise) {
  return (
    [
      "chest",
      "triceps",
      "back",
      "biceps",
      "legs",
      "glutes",
      "cardio",
      "core",
      "shoulders",
      "mobility",
    ].find((group) => primaryHasGroup(exercise, group)) || ""
  );
}
export function samePrimaryMuscle(first, second) {
  const primary = primaryMuscleKey(first);
  return Boolean(primary && primary === primaryMuscleKey(second));
}
export function isRemovedModalityExercise(exercise = {}) {
  const text = clean([
    exercise?.name,
    exercise?.category,
    exercise?.modality,
    exercise?.description,
    exercise?.equipment,
  ].join(" "));
  const removedSport = /\b(?:futsal|soccer|football|swimming|swim|natacao)\b/.test(text);
  return removedSport || excludedExercisePattern.test(text);
}

export function suitableForProfile(exercise, profile = {}) {
  const age = ageFromProfile(profile);
  const level = clean(profile.training_level || "beginner");
  const text = textFor(exercise);
  const goal = clean(profile.goal || profile.objective || "");
  const weightLossGoal = /emagrec|perda de peso|weight loss|fat loss/.test(goal);
  if (isRemovedModalityExercise(exercise)) return false;
  if (weightLossGoal && highImpactExercisePattern.test(text)) return false;
  const avoidAdvanced = age < 18 || age >= 65 || level.includes("beginner") || level.includes("iniciante");
  if (avoidAdvanced && higherSkillWords.some((word) => text.includes(clean(word))))
    return false;
  if (
    age >= 12 &&
    age < 18 &&
    /\b(?:jerk|one rep max|1rm|maximal lift|maximum load)\b/.test(text)
  ) return false;
  return true;
}

export function exerciseEquipmentMode(e) {
  const explicit = clean(e?.equipment_mode);
  if (explicit === "bodyweight" || explicit === "equipment") return explicit;
  return bodyweightValues.some((value) => clean(e?.equipment).includes(value))
    ? "bodyweight"
    : "equipment";
}
export function normalizeEquipmentSelection(value) {
  const text = clean(value);
  if (!text || text === "todos" || text === "all") return "all";
  if (text.includes("sem") || text.includes("casa") || text === "bodyweight")
    return "bodyweight";
  if (
    text.includes("com") ||
    text.includes("ginasio") ||
    text.includes("academia") ||
    text === "equipment"
  )
    return "equipment";
  return "all";
}

export function exerciseMatchesFocus(e, focusKey) {
  if (!e) return false;
  if (focusKey === "recovery")
    return (
      recoveryWords.some((word) => textFor(e).includes(clean(word))) ||
      hasGroup(e, "mobility")
    );
  if (focusKey === "full_body")
    return ["chest", "back", "legs", "core", "shoulders"].some((group) =>
      hasGroup(e, group),
    );
  const focus = daySplit.find((item) => item.key === focusKey);
  return Boolean(focus?.groups.some((group) => primaryHasGroup(e, group)));
}
function focusScore(e, focusKey) {
  if (focusKey === "recovery")
    return recoveryWords.reduce(
      (score, word) => score + (textFor(e).includes(clean(word)) ? 3 : 0),
      0,
    );
  const focus = daySplit.find((item) => item.key === focusKey);
  return (focus?.groups || []).reduce(
    (score, group) =>
      score + (primaryHasGroup(e, group) ? 8 : hasGroup(e, group) ? 2 : 0),
    0,
  );
}
function goalScore(e, goal) {
  const text = textFor(e);
  return (goalWords[goal] || goalWords.condicionamento).reduce(
    (score, word) => score + (text.includes(clean(word)) ? 1 : 0),
    0,
  );
}
function canonicalExerciseName(value) {
  return clean(value)
    .replace(/\([^)]*\)/g, " ")
    .replace(
      /\b(back|front|side|rear|pov|view|angle|left|right|alternate|alternating)\b/g,
      " ",
    )
    .replace(/\b(on knees|kneeling|standing|seated|lying|floor)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
function uniqueExercises(exercises) {
  const seen = new Set();
  return exercises.filter((e) => {
    const key = canonicalExerciseName(e?.name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function rankedForDay(exercises, focusKey, goal, day, requestedMode = "all") {
  const machineBoost =
    focusKey === "legs_glutes" && requestedMode === "equipment"
      ? [
          "machine",
          "smith",
          "trenó",
          "leg press",
          "hack squat",
          "extensão",
          "flexora",
          "curl",
        ].reduce(
          (score, word) =>
            score + (clean(exercises?.[0]?.name).includes(word) ? 1 : 0),
          0,
        )
      : 0;
  return [...exercises]
    .sort((a, b) => {
      const scoreA =
        focusScore(a, focusKey) * 100 +
        goalScore(a, goal) * 3 +
        (a.image_path ? 1 : 0) +
        (focusKey === "legs_glutes" &&
        requestedMode === "equipment" &&
        /machine|smith|sled|leg press|hack squat|leg extension|leg curl|calf/i.test(
          `${a.name} ${a.equipment}`,
        )
          ? 25
          : 0);
      const scoreB =
        focusScore(b, focusKey) * 100 +
        goalScore(b, goal) * 3 +
        (b.image_path ? 1 : 0) +
        (focusKey === "legs_glutes" &&
        requestedMode === "equipment" &&
        /machine|smith|sled|leg press|hack squat|leg extension|leg curl|calf/i.test(
          `${b.name} ${b.equipment}`,
        )
          ? 25
          : 0);
      return (
        scoreB - scoreA ||
        String(a.name || "").localeCompare(String(b.name || ""), "pt-BR")
      );
    })
    .map(
      (exercise, index, list) => list[(index + (day - 1) * 2) % list.length],
    );
}
function rotatePick(list, count, day) {
  if (!list.length) return [];
  if (list.length <= count) return list;
  const start = ((day - 1) * 2) % list.length;
  return Array.from(
    { length: count },
    (_, index) => list[(start + index) % list.length],
  );
}


const calisthenicsBlocks = [
  {title:"Fundamentos e controlo",focus:"Força básica e postura",items:[
    ["Agachamento até à cadeira","2–3 × 8–10",60,"Use uma cadeira firme como referência. Sente-se e levante-se com os pés bem apoiados."],
    ["Flexão na parede","2–3 × 8–10",60,"Mantenha o corpo alinhado e aproxime o peito da parede sem forçar os ombros."],
    ["Ponte de glúteos","2–3 × 10–12",45,"Eleve a bacia sem arquear a lombar e desça devagar."],
    ["Bird dog","2 × 6/lado",45,"Estenda braço e perna opostos sem rodar a bacia."],
    ["Marcha no lugar","3–5 min",30,"Mantenha um ritmo confortável e contínuo."]
  ]},
  {title:"Força fundamental",focus:"Pernas, empurrar e estabilidade",items:[
    ["Agachamento livre controlado","3 × 8–12",60,"Desça apenas até uma amplitude confortável, mantendo os joelhos alinhados."],
    ["Flexão inclinada","3 × 6–10",60,"Apoie as mãos numa bancada firme ou parede e mantenha o tronco alinhado."],
    ["Ponte de glúteos","3 × 10–15",45,"Faça uma pausa curta no topo sem arquear a lombar."],
    ["Dead bug","2 × 8/lado",45,"Mantenha a lombar apoiada e mova braços e pernas de forma alternada."],
    ["Elevação de gémeos","3 × 12–15",45,"Use uma parede como apoio e suba e desça sem balanço."]
  ]},
  {title:"Resistência e coordenação",focus:"Movimentos contínuos de baixo impacto",items:[
    ["Sentar e levantar da cadeira","3 × 10–12",60,"Controle a descida e use uma cadeira estável."],
    ["Flexão inclinada","3 × 8–12",60,"Escolha uma altura que permita completar as repetições com boa técnica."],
    ["Marcha no lugar","3–5 min",30,"Aumente o ritmo apenas se conseguir falar e respirar normalmente."],
    ["Bird dog","2 × 8/lado",45,"Evite rodar o tronco e mantenha o movimento controlado."],
    ["Prancha inclinada","2 × 15–25 s",45,"Apoie as mãos numa superfície firme e mantenha o abdómen ativo."]
  ]},
  {title:"Consolidação e descarga",focus:"Revisão técnica e recuperação",items:[
    ["Agachamento até à cadeira","2 × 8–10",60,"Repita com amplitude confortável e sem impulso."],
    ["Flexão na parede","2 × 8–10",60,"Priorize alinhamento e movimento suave."],
    ["Ponte de glúteos","2 × 10–12",45,"Suba e desça com controlo."],
    ["Dead bug","2 × 6/lado",45,"Mantenha a lombar apoiada e respire normalmente."],
    ["Mobilidade de ombros e quadril","5–7 min",30,"Faça movimentos suaves, sem forçar as articulações."]
  ]}
];

export function buildCalisthenics30DayPlan(profile = {}, exercises = [], goalKey = "condicionamento") {
  const safeProfile = { ...profile, goal: goalKey };
  const age = ageFromProfile(safeProfile);
  const level = safeProfile.training_level || "beginner";
  const beginner = level === "beginner" || level === "iniciante";
  const senior = age >= 60;
  const youth = age >= 12 && age < 18;
  const daysPerWeek = Math.min(6, Math.max(2, Number(profile.training_days_count) || 3));
  const trainingWeekDays = trainingDaysForCount(daysPerWeek);
  const requestedIntensity = profile.training_intensity || (senior || beginner ? "easy" : "moderate");
  const intensity = youth && requestedIntensity === "hard" ? "moderate" : requestedIntensity;
  const baseSets = youth || senior || beginner
    ? 2
    : intensity === "hard"
      ? 4
      : intensity === "easy"
        ? 2
        : 3;

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const week = Math.min(3, Math.floor((day - 1) / 8));
    const rest = !trainingWeekDays.has(((day - 1) % 7) + 1);
    const block = calisthenicsBlocks[week];

    const rawExercises = rest
      ? [{
          id: "cal-rest-" + day,
          name: "Caminhada leve e mobilidade",
          category: "Recuperação",
          equipment: "Sem equipamento",
          sets: 1,
          reps: "10–20 min",
          rest_seconds: 0,
          description: "Ritmo confortável e mobilidade sem dor.",
          image_path: null,
        }]
      : block.items.map((item, itemIndex) => {
          const prescriptionParts = String(item[1] || "").split(/×|x/i);
          const setText = prescriptionParts[0] || "";
          const reps = prescriptionParts.slice(1).join(" × ").trim() || item[1];
          const setMatch = setText.match(/(\d+)\s*(?:[-–]\s*(\d+))?/);
          const plannedSets = /[-–]/.test(setText)
            ? Math.min(baseSets, Number(setMatch?.[2]) || baseSets)
            : Number(setMatch?.[1]) || baseSets;
          return {
            id: "cal-" + day + "-" + itemIndex,
            name: item[0],
            category: "Calistenia",
            equipment: "Peso corporal / barra baixa / paralelas estáveis",
            sets: senior ? Math.min(2, plannedSets) : plannedSets,
            reps,
            rest_seconds: item[2],
            description: item[3],
            image_path: null,
            day_number: day,
            sort_order: itemIndex,
          };
        });

    const cardioGoalDay = !rest && ["emagrecimento", "definicao", "condicionamento"].includes(goalKey) && runningDays.has(day);
    if (cardioGoalDay) {
      const cardioOptions = uniqueExercises(exercises).filter(
        (exercise) =>
          isTimedExercise(exercise) &&
          suitableForProfile(exercise, safeProfile) &&
          exerciseEquipmentMode(exercise) === "bodyweight" &&
          exerciseMatchesFocus(exercise, "cardio_core"),
      );
      rawExercises.push(...rotatePick(cardioOptions, 1, day));
    }
    const exercises = rawExercises.filter((exercise) => suitableForProfile(exercise, safeProfile)).map((exercise) => {
      const timed = isTimedExercise(exercise);
      const durationSeconds = timed
        ? exerciseDurationSeconds(exercise, profile, intensity)
        : null;
      return {
        ...exercise,
        sets: timed ? 1 : exercise.sets,
        reps: timed ? null : exercise.reps,
        duration_seconds: durationSeconds,
        rest_seconds: timed ? 0 : exercise.rest_seconds,
      };
    });
    const timedCount = exercises.filter((exercise) => isTimedExercise(exercise)).length;

    return {
      day,
      title: "Dia " + day + " · " + (rest ? "Recuperação" : block.title),
      focus: rest ? "Mobilidade e recuperação" : block.focus,
      focus_key: rest ? "recovery" : "full_body",
      level,
      intensity,
      rest,
      equipment_mode: "bodyweight",
      sessionType: timedCount === 0 ? "sets" : timedCount === exercises.length ? "timed" : "mixed",
      sessionLabel: rest ? "Recuperação ativa por tempo" : "Progressão de calistenia",
      progressionNote: week === 0
        ? "Aprenda a técnica e encontre uma variante controlada."
        : week === 1
          ? "Aumente repetições apenas se mantiver a técnica."
          : week === 2
            ? "Consolide estabilidade escapular, punhos e core."
            : "Reduza o volume e revise a qualidade do movimento.",
      skillNote: "Plano com movimentos básicos e escaláveis. Ajuste a amplitude e use parede ou cadeira como apoio quando necessário; não treine com dor.",
      exercises,
    };
  });
}

const martialArtsBlocks = {
  boxe: [
    { title: "Base, guarda e coordenação", focus: "Fundamentos do boxe", items: [
      ["Aquecimento com marcha e mobilidade", "4–5 min", 30, "Aqueça de forma gradual e movimente ombros, quadris e tornozelos."],
      ["Base e guarda de boxe", "20–30 s", 30, "Mantenha os pés estáveis, mãos protegendo o rosto e ombros relaxados."],
      ["Sombra: jab e direto", "20–30 s", 45, "Execute os golpes no ar, sem impacto, voltando à guarda a cada repetição."],
      ["Deslocamento frontal e lateral", "20–30 s", 45, "Use passos curtos e mantenha equilíbrio, sem cruzar os pés."],
      ["Prancha inclinada", "10–12 repetições", 45, "Apoie as mãos numa superfície firme e mantenha o tronco alinhado."]
    ]},
    { title: "Combinações simples e deslocamento", focus: "Coordenação e ritmo", items: [
      ["Sombra: jab, direto e retorno à guarda", "30–40 s", 45, "Faça a sequência devagar, com controle e sem contato."],
      ["Deslocamento com passos curtos", "30–40 s", 45, "Avance e recue mantendo a base e a distância confortável."],
      ["Esquiva leve sem impacto", "20–30 s", 45, "Faça pequenas flexões de joelhos e movimentos controlados do tronco."],
      ["Agachamento livre controlado", "8–10 repetições", 60, "Desça apenas até uma amplitude confortável, mantendo os pés apoiados."],
      ["Prancha inclinada", "12–15 repetições", 45, "Mantenha o abdômen ativo e evite arquear a lombar."]
    ]},
    { title: "Sequências e condicionamento", focus: "Técnica e resistência", items: [
      ["Sombra: combinações simples", "35–45 s", 60, "Alterne jab e direto no ar, sem acelerar além do controle técnico."],
      ["Passos laterais e mudança de direção", "30–40 s", 45, "Mude de direção com passos pequenos e estáveis."],
      ["Esquiva e retorno à base", "25–35 s", 45, "Incline o tronco de forma leve e recupere a posição inicial."],
      ["Flexão inclinada", "6–10 repetições", 60, "Escolha uma altura que permita manter a postura."],
      ["Agachamento livre controlado", "10–12 repetições", 60, "Suba sem impulso e mantenha os joelhos alinhados com os pés."]
    ]},
    { title: "Consolidação técnica", focus: "Revisão e controle", items: [
      ["Sombra técnica com ritmo controlado", "30–40 s", 45, "Priorize precisão, respiração e retorno à guarda."],
      ["Base, guarda e deslocamento", "30–40 s", 45, "Combine passos curtos com postura equilibrada."],
      ["Coordenação: jab e direto", "30–40 s", 45, "Faça os movimentos no ar, sem atingir objetos ou pessoas."],
      ["Mobilidade de ombros e quadril", "3–5 min", 30, "Faça movimentos suaves e sem forçar as articulações."],
      ["Prancha inclinada", "10–12 repetições", 45, "Termine com controle e sem prender a respiração."]
    ]}
  ],
  karate: [
    { title: "Bases e fundamentos", focus: "Preparação do karatê", items: [
      ["Aquecimento com marcha e mobilidade", "4–5 min", 30, "Aqueça gradualmente e prepare tornozelos, quadris e ombros."],
      ["Base zenkutsu-dachi com apoio", "15–25 s", 30, "Pratique a posição com amplitude confortável e apoio próximo, se necessário."],
      ["Kihon: soco reto no ar", "6–8 por lado", 45, "Estenda o braço sem travar o cotovelo e retorne à posição inicial."],
      ["Kihon: bloqueio baixo no ar", "6–8 por lado", 45, "Faça o bloqueio lentamente, sem movimentos bruscos."],
      ["Deslocamento curto em base", "20–30 s", 45, "Mantenha o equilíbrio e evite passos longos."]
    ]},
    { title: "Kihon e deslocamentos", focus: "Coordenação e postura", items: [
      ["Base e guarda com troca controlada", "20–30 s", 30, "Alterne a base sem perder o equilíbrio."],
      ["Kihon: oi-zuki no ar", "8–10 por lado", 45, "Execute o soco no ar com controle e sem hiperestender o braço."],
      ["Kihon: bloqueio médio no ar", "6–8 por lado", 45, "Pratique o caminho do braço lentamente e sem impacto."],
      ["Deslocamento em base", "25–35 s", 45, "Avance e recue com passos curtos."],
      ["Agachamento até cadeira", "8–10 repetições", 60, "Use uma cadeira estável como referência e mantenha os pés apoiados."]
    ]},
    { title: "Sequências técnicas e estabilidade", focus: "Kihon, coordenação e core", items: [
      ["Kihon: soco e bloqueio alternados", "30–40 s", 45, "Alterne os movimentos no ar, mantendo a postura."],
      ["Sequência introdutória de kata", "25–35 s", 60, "Revise apenas movimentos básicos já conhecidos, sem acelerar."],
      ["Deslocamento e giro controlado", "20–30 s", 45, "Gire com passos pequenos, sem torcer o joelho."],
      ["Elevação de gémeos", "10–12 repetições", 45, "Suba e desça lentamente, usando apoio se necessário."],
      ["Prancha inclinada", "10–15 repetições", 45, "Mantenha o tronco alinhado e respire normalmente."]
    ]},
    { title: "Revisão e consolidação", focus: "Fundamentos e mobilidade", items: [
      ["Revisão de bases e guarda", "25–35 s", 30, "Revise as posições com estabilidade e sem forçar os joelhos."],
      ["Kihon: oi-zuki e bloqueios", "30–40 s", 45, "Execute os fundamentos no ar e com velocidade confortável."],
      ["Sequência técnica sem contato", "25–35 s", 60, "Junte movimentos básicos que já domina, sem sparring."],
      ["Mobilidade de quadril e tornozelo", "3–5 min", 30, "Faça movimentos suaves, sem dor."],
      ["Agachamento até cadeira", "8–10 repetições", 60, "Controle a descida e use uma cadeira firme."]
    ]}
  ]
};

export function buildMartialArts30DayPlan(profile = {}, modality = "boxe", goalKey = "condicionamento") {
  const age = ageFromProfile(profile);
  const level = clean(profile.training_level || "beginner");
  const youth = age >= 12 && age < 18;
  const senior = age >= 60;
  const requestedIntensity = profile.training_intensity || (senior || level.includes("beginner") ? "easy" : "moderate");
  const intensity = youth && requestedIntensity === "hard" ? "moderate" : requestedIntensity;
  const daysPerWeek = Math.min(6, Math.max(2, Number(profile.training_days_count || profile.training_frequency) || 3));
  const trainingWeekDays = trainingDaysForCount(daysPerWeek);
  const baseSets = youth || senior || level.includes("beginner")
    ? 2
    : intensity === "hard" ? 4 : intensity === "easy" ? 2 : 3;
  const blocks = martialArtsBlocks[modality] || martialArtsBlocks.boxe;
  const modalityName = modality === "karate" ? "Karatê" : "Boxe";

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const week = Math.min(3, Math.floor((day - 1) / 8));
    const rest = !trainingWeekDays.has(((day - 1) % 7) + 1);
    const block = blocks[week];
    const rawExercises = rest
      ? [{
          name: "Caminhada leve e mobilidade",
          reps: "10–20 min",
          rest_seconds: 0,
          description: "Recuperação em ritmo confortável, com movimentos suaves e sem dor.",
          equipment: "Sem equipamento",
          category: "Recuperação"
        }]
      : block.items.map(([name, reps, restSeconds, description]) => ({
          name, reps, rest_seconds: restSeconds, description,
          equipment: "Sem equipamento", category: modalityName
        }));

    if (!rest && goalKey === "bulking") {
      rawExercises.push({
        name: "Flexão inclinada", reps: "6–10 repetições", rest_seconds: 60,
        description: "Use uma superfície firme e uma inclinação adequada ao seu nível.",
        equipment: "Sem equipamento", category: "Força complementar"
      });
    } else if (!rest && ["emagrecimento", "definicao", "condicionamento"].includes(goalKey) && day % 2 === 0) {
      rawExercises.push({
        name: "Marcha acelerada no lugar", reps: "2–3 min", rest_seconds: 0,
        description: "Mantenha um ritmo sustentável, respire normalmente e reduza a velocidade se necessário.",
        equipment: "Sem equipamento", category: "Condicionamento"
      });
    }

    const exercises = rawExercises.map((exercise, order) => {
      const timed = isTimedExercise(exercise);
      return {
        ...exercise,
        id: `${modality}-${day}-${order}`,
        sets: timed ? 1 : (senior ? Math.min(2, baseSets) : baseSets),
        reps: timed ? null : exercise.reps,
        duration_seconds: timed ? exerciseDurationSeconds(exercise, profile, intensity) : null,
        rest_seconds: timed ? 0 : exercise.rest_seconds,
        day_number: day, sort_order: order
      };
    });
    const timedCount = exercises.filter(isTimedExercise).length;
    return {
      day,
      title: `Dia ${day} · ${rest ? "Recuperação" : block.title}`,
      focus: rest ? "Mobilidade e recuperação" : block.focus,
      focus_key: rest ? "recovery" : "full_body",
      groups: rest ? ["mobility"] : ["cardio", "core", "full_body"],
      level, intensity, rest, equipment_mode: "bodyweight",
      sessionType: timedCount === 0 ? "sets" : timedCount === exercises.length ? "timed" : "mixed",
      sessionLabel: rest ? "Recuperação ativa" : `${modalityName} · fundamentos e condicionamento sem contato`,
      progressionNote: week === 0
        ? "Comece devagar e aprenda a postura de cada movimento."
        : week === 1
          ? "Aumente o ritmo apenas se mantiver a técnica."
          : week === 2
            ? "Consolide coordenação, equilíbrio e controle da respiração."
            : "Revise os fundamentos com qualidade e reduza o ritmo se necessário.",
      skillNote: "Plano introdutório sem contato. Aprenda golpes, bloqueios e kata com orientação de um instrutor; não faça sparring sem supervisão.",
      exercises
    };
  });
}

export function focusForDay(day, modality = "musculacao") {
  const directKey = clean(typeof modality === "object" ? modality?.modality || "" : modality);
  const schedule =
    modalitySchedules[directKey] ||
    modalitySchedules[modalityKeyFor(modality)] ||
    modalitySchedules.musculacao;
  const key = schedule[(Math.max(1, Number(day) || 1) - 1) % schedule.length];
  return daySplit.find((item) => item.key === key) || daySplit[0];
}
export function build30DayPlan(
  exercises = [],
  goal = "condicionamento",
  level = "beginner",
  intensity = "moderate",
  equipment = "",
  profile = {},
) {
  const requestedMode = normalizeEquipmentSelection(equipment);
  const counts = { easy: 4, moderate: 5, hard: 6 };
  const ageForDose = ageFromProfile(profile);
  const youth = ageForDose >= 12 && ageForDose < 18;
  const safeIntensity = youth && intensity === "hard" ? "moderate" : intensity;
  const daysPerWeek = Math.min(6, Math.max(2, Number(profile.training_days_count || profile.training_frequency) || 3));
  const trainingWeekDays = trainingDaysForCount(daysPerWeek);
  const experienceFactor = youth ? 0.75 : level === "advanced" ? 1 : level === "intermediate" ? 0.9 : 0.75;
  const ageFactor = ageForDose >= 65 ? 0.6 : ageForDose >= 50 ? 0.8 : 1;
  const requestedCount = Math.max(2, Math.round((counts[safeIntensity] || counts.moderate) * experienceFactor * ageFactor));
  const modality = modalityKeyFor(profile);
  const goalKey = exerciseGoalKeyFor(profile, goal);
  if (["boxe", "karate"].includes(modality)) return buildMartialArts30DayPlan(
    { ...profile, training_level: level, training_intensity: safeIntensity },
    modality,
    goalKey,
  );
  if (modality === "calistenia") return buildCalisthenics30DayPlan(
    { ...profile, training_level: level, training_intensity: safeIntensity },
    exercises,
    goalKey,
  );

  const planningProfile = { ...profile, goal: goalKey };
  const source = uniqueExercises(exercises).filter(
    (exercise) => (exercise?.image_path || exercise?.gifUrl) && suitableForProfile(exercise, planningProfile),
  );
  const filtered = source.filter(
    (exercise) => requestedMode === "all" || exerciseEquipmentMode(exercise) === requestedMode,
  );

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const scheduledWorkoutDay = trainingWeekDays.has(((day - 1) % 7) + 1);
    const goalCardioDay = ["emagrecimento", "definicao", "condicionamento"].includes(goalKey) && runningDays.has(day);
    const focus = scheduledWorkoutDay
      ? goalCardioDay
        ? daySplit.find((item) => item.key === "cardio_core") || focusForDay(day, modality)
        : focusForDay(day, modality)
      : daySplit.find((item) => item.key === "recovery") || daySplit[0];
    const isRecovery = !scheduledWorkoutDay || focus.key === "recovery";
    const exact = filtered.filter((exercise) => exerciseMatchesFocus(exercise, focus.key));
    const ranked = rankedForDay(exact, focus.key, goalKey, day, requestedMode);
    const cardioFirst = focus.key === "cardio_core";
    const selected = rotatePick(
      ranked,
      isRecovery
        ? Math.min(3, ranked.length)
        : cardioFirst
          ? Math.min(5, requestedCount, ranked.length)
          : requestedCount,
      day,
    );

    const isRunDay = scheduledWorkoutDay && goalKey === "emagrecimento" && runningDays.has(day);
    const age = ageFromProfile(profile);
    const youth = age >= 12 && age < 18;
    const defaultSets = youth || age >= 65
      ? 2
      : safeIntensity === "hard"
        ? 4
        : safeIntensity === "easy"
          ? 2
          : 3;
    const defaultReps = youth
      ? "8–12"
      : age >= 65
        ? "8–10"
        : safeIntensity === "hard"
          ? "10–15"
          : safeIntensity === "easy"
            ? "8–10"
            : "8–12";
    const recoveryFallback = {
      id: "recovery-walk-" + day,
      name: "Caminhada leve e mobilidade",
      category: "Recuperação",
      equipment: "Sem equipamento",
      sets: 1,
      reps: "10–15 min",
      rest_seconds: 0,
      description: "Ritmo confortável, respiração normal e movimentos suaves, sem dor.",
      image_path: null,
    };
    const exercisesForDay = selected.length ? selected : [recoveryFallback];

    const plannedExercises = exercisesForDay.map((exercise, order) => {
      const timed = isTimedExercise(exercise);
      const durationSeconds = timed
        ? exerciseDurationSeconds(exercise, profile, safeIntensity)
        : null;
      const isDefaultExerciseDbDose = exercise.source === "ExerciseDB gratuito" || !exercise.reps || exercise.reps === "8–12";
      const reps = timed
        ? null
        : isDefaultExerciseDbDose
          ? defaultReps
          : exercise.reps;

      return {
        ...exercise,
        sets: timed ? 1 : defaultSets,
        reps,
        duration_seconds: durationSeconds,
        rest_seconds: timed ? 0 : exercise.rest_seconds || 60,
        day_number: day,
        sort_order: order,
      };
    });
    const timedCount = plannedExercises.filter((exercise) => isTimedExercise(exercise)).length;
    const sessionType = timedCount === 0
      ? "sets"
      : timedCount === plannedExercises.length
        ? "timed"
        : "mixed";

    return {
      day,
      title: `Dia ${day} · ${focus.label}`,
      focus: focus.label,
      focus_key: focus.key,
      groups: focus.groups,
      level,
      intensity: safeIntensity,
      rest: isRecovery,
      equipment_mode: requestedMode,
      isRunDay,
      sessionType,
      sessionLabel: isRunDay || (timedCount > 0 && timedCount === plannedExercises.length)
        ? "Treino contínuo por tempo"
        : timedCount > 0
          ? "Treino misto: tempo e repetições"
          : isRecovery
            ? "Recuperação ativa"
            : "Treino específico da modalidade",
      exercises: plannedExercises,
    };
  });
}

export const intensityLabels = {
  easy: "Fácil",
  moderate: "Médio",
  hard: "Difícil",
};
export const intensityNotes = {
  easy: "Volume reduzido para começar com controle.",
  moderate: "Volume equilibrado para evoluir com consistência.",
  hard: "Mais puxado: mais exercícios, séries e repetições. Respeite seus limites.",
};

