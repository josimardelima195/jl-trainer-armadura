const pad = (value) => String(value).padStart(2, "0");

export function localDateKey(value) {
  if (value === null || value === undefined || value === "") return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function localNoon(dateKey) {
  const [year, month, day] = String(dateKey || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function accountDateForDay(createdAt, dayNumber) {
  const startKey = localDateKey(createdAt);
  const date = localNoon(startKey);
  if (!date) return "";
  date.setDate(date.getDate() + Math.max(0, Number(dayNumber) - 1));
  return localDateKey(date);
}

export function accountDayNumber(createdAt, now = new Date()) {
  const startKey = localDateKey(createdAt);
  const currentKey = localDateKey(now);
  const start = localNoon(startKey);
  const current = localNoon(currentKey);
  if (!start || !current) return 1;
  const ordinal = (date) => Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  return Math.max(1, ordinal(current) - ordinal(start) + 1);
}

function trainingWeekdays(profile = {}) {
  const aliases = {
    dom:0, domingo:0, sun:0,
    seg:1, segunda:1, "segunda-feira":1, mon:1, monday:1,
    ter:2, terça:2, terca:2, "terça-feira":2, "terca-feira":2, tue:2, tuesday:2,
    qua:3, quarta:3, "quarta-feira":3, wed:3, wednesday:3,
    qui:4, quinta:4, "quinta-feira":4, thu:4, thursday:4,
    sex:5, sexta:5, "sexta-feira":5, fri:5, friday:5,
    sáb:6, sab:6, sábado:6, sabado:6, "sábado-feira":6, sat:6, saturday:6,
  };
  const selected = Array.isArray(profile.training_days) ? profile.training_days : [];
  const parsed = selected.map((value) => {
    if (Number.isInteger(value) && value >= 0 && value <= 6) return value;
    const key = String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    return aliases[key] ?? aliases[key.slice(0, 3)];
  }).filter((value) => Number.isInteger(value));
  if (parsed.length) return new Set(parsed);
  const schedules = {
    2: [1, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 6],
    5: [1, 2, 3, 5, 6],
    6: [1, 2, 3, 4, 5, 6],
  };
  const count = Math.min(6, Math.max(2, Number(profile.training_days_count || profile.training_frequency) || 3));
  return new Set(schedules[count] || schedules[3]);
}

export function accountDayStatuses(createdAt, workoutLogs = [], nutritionLogs = [], now = new Date(), profile = {}) {
  const startKey = localDateKey(createdAt);
  const todayKey = localDateKey(now);
  const start = localNoon(startKey);
  if (!start || !todayKey || startKey > todayKey) {
    return { days: [], missedWorkoutDays: 0, missedNutritionDays: 0 };
  }

  const workoutDates = new Set(
    workoutLogs
      .map((log) => String(log.local_date || localDateKey(log.completed_at)).slice(0, 10))
      .filter(Boolean),
  );
  const nutritionByDate = new Map(
    nutritionLogs.map((log) => [
      String(log.local_date || "").slice(0, 10),
      {
        expected: Math.max(0, Number(log.expected_meals) || 0),
        completed: new Set(Array.isArray(log.meal_keys) ? log.meal_keys : []).size,
      },
    ]),
  );

  const days = [];
  const cursor = start;
  const scheduledDays = trainingWeekdays(profile);
  while (days.length < 30 && localDateKey(cursor) <= todayKey) {
    const date = localDateKey(cursor);
    const weekday = localNoon(date)?.getDay();
    const workoutExpected = scheduledDays.has(weekday);
    const workoutDone = workoutDates.has(date);
    const workoutComplete = !workoutExpected || workoutDone;
    const nutrition = nutritionByDate.get(date);
    const nutritionDone = Boolean(
      nutrition && nutrition.expected > 0 && nutrition.completed >= nutrition.expected,
    );
    const past = date < todayKey;
    const dayComplete = workoutComplete && nutritionDone;
    const workoutMissed = past && workoutExpected && !workoutDone;
    const nutritionMissed = past && !nutritionDone;
    days.push({
      day: days.length + 1,
      date,
      workoutExpected,
      workoutDone,
      workoutComplete,
      nutritionDone,
      dayComplete,
      workoutMissed,
      nutritionMissed,
      missed: past && (workoutMissed || nutritionMissed),
      isToday: date === todayKey,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    days,
    missedWorkoutDays: days.filter((item) => item.workoutMissed).length,
    missedNutritionDays: days.filter((item) => item.nutritionMissed).length,
  };
}
