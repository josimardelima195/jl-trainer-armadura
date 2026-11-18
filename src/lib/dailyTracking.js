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

export function accountDayStatuses(createdAt, workoutLogs = [], nutritionLogs = [], now = new Date()) {
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
  while (localDateKey(cursor) <= todayKey) {
    const date = localDateKey(cursor);
    const workoutDone = workoutDates.has(date);
    const nutrition = nutritionByDate.get(date);
    const nutritionDone = Boolean(
      nutrition && nutrition.expected > 0 && nutrition.completed >= nutrition.expected,
    );
    const past = date < todayKey;
    days.push({
      day: days.length + 1,
      date,
      workoutDone,
      nutritionDone,
      workoutMissed: past && !workoutDone,
      nutritionMissed: past && !nutritionDone,
      missed: past && (!workoutDone || !nutritionDone),
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
