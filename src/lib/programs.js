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
  futsal: [
    "sprint",
    "agility",
    "lateral",
    "jump",
    "calf",
    "run",
    "lunge",
    "squat",
    "plyometric",
  ],
  karate: ["kick", "punch", "martial", "hip", "mobility", "plank", "lunge"],
  natacao: ["swim", "stroke", "kick", "lat", "shoulder", "core", "mobility"],
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
  futsal: ["cardio_core", "legs_glutes", "shoulders_mobility", "cardio_core", "full_body", "legs_glutes", "recovery"],
  karate: ["full_body", "cardio_core", "legs_glutes", "shoulders_mobility", "cardio_core", "full_body", "recovery"],
  natacao: ["back_biceps", "shoulders_mobility", "legs_glutes", "cardio_core", "full_body", "back_biceps", "recovery"],
};
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
  if (bodyParts.includes("cardio") || category === "cardio" || muscles.includes("cardiovascular system")) return true;
  if (/\b\d+\s*(?:m|metros)\b/.test(reps)) return false;

  const continuousMovement = /\b(?:stationary bike|stationary bicycle|exercise bike|hands bike|bike|bicicleta ergonometrica|bicicleta estacionaria|cycling|cycle cross trainer|elliptical|stepmill|treadmill|esteira|running|run|jog|corrida|correr|jump rope|jack jump|star jump|jumping jacks?|polichinelos?|pular corda|high knees|mountain climbers?|bear crawl|burpees?|skater hops|battling ropes|march in place|marcha no lugar|caminhada|walking|sprints?|wind sprints?|farmers walk)\b/.test(name);
  if (continuousMovement) return true;

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
  const modalityText = clean(typeof value === "object" ? value?.modality || "" : value);
  const goalText = clean(typeof value === "object" ? value?.goal || "" : "");
  const detect = (text) => {
    if (text.includes("calisten")) return "calistenia";
    if (text.includes("futsal")) return "futsal";
    if (text.includes("karat")) return "karate";
    if (text.includes("nata")) return "natacao";
    if (text.includes("emag")) return "emagrecimento";
    if (text.includes("defini") || text.includes("cut")) return "definicao";
    if (text.includes("bulking")) return "bulking";
    if (text.includes("muscul")) return "musculacao";
    if (text.includes("massa")) return "massa";
    if (text.includes("casa")) return "casa";
    return "";
  };
  const modalityKey = detect(modalityText);
  if (["calistenia", "futsal", "karate", "natacao"].includes(modalityKey)) return modalityKey;
  return detect(goalText) || modalityKey || detect(modalityText + " " + goalText) || "condicionamento";
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
export function suitableForProfile(exercise, profile = {}) {
  const age = ageFromProfile(profile),
    text = textFor(exercise);
  if (age < 18 && higherSkillWords.some((word) => text.includes(word)))
    return false;
  if (age >= 65 && higherSkillWords.some((word) => text.includes(word)))
    return false;
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
 {title:"Fundamentos e controlo",focus:"Técnica e preparação",items:[
 ["Flexão inclinada","2–3 × 6–10",60,"Mãos numa superfície firme; corpo alinhado."],
 ["Remada australiana assistida","2–3 × 6–10",75,"Use barra baixa estável e mantenha escápulas controladas."],
 ["Agachamento livre","2–3 × 10–15",60,"Amplitude confortável, sem dor."],
 ["Hollow hold regressivo","3 × 10–20 s",45,"Lombar apoiada; encurte a alavanca se arquear."],
 ["Scapular push-up","2 × 8–12",45,"Movimento controlado das escápulas."]
 ]},
 {title:"Força fundamental",focus:"Empurrar, puxar e pernas",items:[
 ["Flexão adaptada","3 × 6–12",90,"Escolha a variante que permite técnica estável."],
 ["Remada australiana","3 × 6–10",90,"Sem balanço; use altura adequada."],
 ["Afundo alternado","3 × 8/lado",75,"Joelho acompanha a direção dos pés."],
 ["Prancha frontal","3 × 20–35 s",45,"Respire e mantenha alinhamento."],
 ["Dead bug","2 × 8/lado",45,"Controle a lombar."]
 ]},
 {title:"Pré-habilidades",focus:"Estabilidade de ombros e core",items:[
 ["Pike push-up regressiva","3 × 5–8",90,"Amplitude confortável; não treine com dor."],
 ["Scapular pull-up assistida","3 × 5–8",90,"Use apoio dos pés se necessário."],
 ["Frog stand com apoio","3 × 8–15 s",60,"Somente com punhos preparados e espaço livre."],
 ["L-sit tuck com apoio","3 × 8–12 s",60,"Use paralelas estáveis; não force."],
 ["Elevação de gémeos","3 × 12–18",45,"Subida e descida controladas."]
 ]},
 {title:"Consolidação e descarga",focus:"Técnica, mobilidade e recuperação",items:[
 ["Flexão técnica","2 × 6–10",90,"Pare com 2–3 repetições em reserva."],
 ["Remada australiana assistida","2 × 6–10",90,"Sem balanço."],
 ["Agachamento pausado","2 × 8–12",60,"Pausa curta em amplitude confortável."],
 ["Hollow hold regressivo","2 × 15–20 s",45,"Sem perder a posição lombar."],
 ["Mobilidade de punho e ombro","1 × 5–7 min",30,"Movimentos suaves, sem dor."]
 ]}
];
export function buildCalisthenics30DayPlan(profile = {}) {
  const age = ageFromProfile(profile);
  const level = profile.training_level || "beginner";
  const beginner = level === "beginner" || level === "iniciante";
  const senior = age >= 60;
  const daysPerWeek = Math.min(6, Math.max(2, Number(profile.training_days_count) || 3));
  const intensity = profile.training_intensity || (senior || beginner ? "easy" : "moderate");
  const baseSets = senior || beginner
    ? 2
    : intensity === "hard"
      ? 4
      : intensity === "easy"
        ? 2
        : 3;

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const week = Math.min(3, Math.floor((day - 1) / 8));
    const rest = day % 7 === 0 || (daysPerWeek <= 3 && [2, 4, 6].includes((day - 1) % 7));
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

    const exercises = rawExercises.map((exercise) => {
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
      skillNote: "Planche é uma habilidade avançada. Este ciclo prepara punhos, ombros, escápulas e core; não garante planche em 30 dias.",
      exercises,
    };
  });
}

export function focusForDay(day, goal = "condicionamento") {
  const schedule =
    modalitySchedules[modalityKeyFor(goal)] ||
    modalitySchedules.condicionamento;
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
  const experienceFactor = level === "advanced" ? 1 : level === "intermediate" ? 0.9 : 0.75;
  const ageFactor = ageForDose >= 65 ? 0.6 : ageForDose >= 50 ? 0.8 : 1;
  const requestedCount = Math.max(2, Math.round((counts[intensity] || counts.moderate) * experienceFactor * ageFactor));
  const modality = modalityKeyFor(goal);
  if (modality === "calistenia") return buildCalisthenics30DayPlan({ ...profile, training_level: level, training_intensity: intensity });

  const source = uniqueExercises(exercises).filter(
    (exercise) => (exercise?.image_path || exercise?.gifUrl) && suitableForProfile(exercise, profile),
  );
  const filtered = source.filter(
    (exercise) => requestedMode === "all" || exerciseEquipmentMode(exercise) === requestedMode,
  );

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const focus = focusForDay(day, modality);
    const isRecovery = focus.key === "recovery";
    const exact = filtered.filter((exercise) => exerciseMatchesFocus(exercise, focus.key));
    const ranked = rankedForDay(exact, focus.key, modality, day, requestedMode);
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

    const isRunDay = modality === "emagrecimento" && runningDays.has(day);
    const age = ageFromProfile(profile);
    const youth = age < 18;
    const defaultSets = youth || age >= 65
      ? 2
      : intensity === "hard"
        ? 4
        : intensity === "easy"
          ? 2
          : modality === "natacao"
            ? 4
            : 3;
    const defaultReps = modality === "karate"
      ? "8–12 por lado"
      : modality === "natacao"
        ? "25 m"
        : youth
          ? "8–12"
          : age >= 65
            ? "8–10"
            : intensity === "hard"
              ? "10–15"
              : intensity === "easy"
                ? "8–10"
                : "8–12";

    const plannedExercises = selected.map((exercise, order) => {
      const timed = isTimedExercise(exercise);
      const durationSeconds = timed
        ? exerciseDurationSeconds(exercise, profile, intensity)
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
      intensity,
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

