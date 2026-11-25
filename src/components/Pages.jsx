import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { planMatrix } from "../lib/model";
import { upload, openMedia } from "../lib/storage";
import { Title, Stat, Empty, Locked, Field, LeoMascot } from "./UI";
import {
  build30DayPlan,
  intensityLabels,
  intensityNotes,
  exerciseEquipmentMode,
  normalizeEquipmentSelection,
  modalityKeyFor,
  exerciseGoalKeyFor,
  ageFromProfile,
  isTimedExercise,
  exerciseDurationSeconds,
  samePrimaryMuscle,
  suitableForProfile,
  isRemovedModalityExercise,
} from "../lib/programs";
import {
  foodLibrary,
  nutritionPlan,
  buildShoppingList,
  supplementCatalog,
  foodSubstitutions,
} from "../lib/nutrition";
import { useLanguage, translatedInstructions, languageOptions, translateUiText, translateFoodName, translateIngredientString, translateMealLabel, translateExerciseName } from "../lib/i18n";
import { accountDateForDay, accountDayNumber, accountDayStatuses, localDateKey } from "../lib/dailyTracking";
function ExerciseGif({ exercise, variant = "thumb" }) {
  const [failed, setFailed] = useState(false);
  const [language] = useLanguage();
  const exerciseName = translateExerciseName(exercise?.name, language);
  const source = exercise?.image_path || exercise?.gifUrl;
  const exerciseLabel = `${exercise?.name || ""} ${exercise?.category || ""}`;
  const fallbackLabel = /boxe|boxing/i.test(exerciseLabel)
    ? "🥊 Boxe"
    : /karate|karatê/i.test(exerciseLabel)
      ? "🥋 Karatê"
      : "GIF indisponível";
  return (
    <div className={`exercise-gif exercise-gif-${variant}`}>
      {source && !failed ? (
        <img
          src={source}
          alt={exerciseName}
          loading={variant === "guided" ? "eager" : "lazy"}
          fetchPriority={variant === "guided" ? "high" : "low"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="exercise-gif-fallback">{fallbackLabel}</span>
      )}
    </div>
  );
}

const equipmentLabel = (exercise) => exercise?.equipment || "Sem equipamento";
const muscleLabel = (exercise) => {
  const labels = {
    pectorals: "peito",
    triceps: "tríceps",
    biceps: "bíceps",
    "upper back": "costas",
    "latissimus dorsi": "costas",
    "erector spinae": "lombar",
    deltoids: "ombros",
    quadriceps: "quadríceps",
    hamstrings: "posterior",
    glutes: "glúteos",
    calves: "panturrilhas",
    abdominals: "abdômen",
    "cardiovascular system": "cardio",
  };
  const values = exercise?.primary_muscles || [];
  return values.length
    ? values
        .map((value) => labels[String(value).toLowerCase()] || value)
        .join(", ")
    : exercise?.category || "movimento geral";
};
function RestClock({ seconds, nonce, onClear }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    if (!seconds) return;
    const deadline = Date.now() + seconds * 1000;
    const id = setInterval(
      () => setLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))),
      250,
    );
    return () => clearInterval(id);
  }, [seconds, nonce]);
  return (
    <>
      {left > 0 ? `${left}s` : "Pronto"}
      <button className="text-btn" onClick={onClear}>
        Encerrar descanso
      </button>
    </>
  );
}
function formatExerciseDuration(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  if (minutes && rest) return minutes + " min " + rest + " s";
  if (minutes) return minutes + " min";
  return (rest || total) + " s";
}
function formatCountdown(seconds) {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  return String(Math.floor(value / 60)).padStart(2, "0") + ":" + String(value % 60).padStart(2, "0");
}
function GuidedWorkout({
  exercises,
  setsFor,
  repsFor,
  durationFor,
  isTimedFor,
  onExit,
  onSeriesComplete,
  language,
}) {
  const [index, setIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerState, setTimerState] = useState("idle");
  const exercise = exercises[index];
  const timed = Boolean(exercise && isTimedFor(exercise));
  const totalSets = exercise ? setsFor(exercise) : 1;
  const durationSeconds = timed ? Math.max(10, Number(durationFor(exercise)) || 60) : 0;
  const instructions = exercise ? translatedInstructions(exercise, language) : [];

  useEffect(() => {
    if (!timed || timerState !== "running") return;
    const interval = setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timed, timerState]);

  useEffect(() => {
    if (!timed || timerState !== "running" || timeLeft > 0) return;
    setTimerState("done");
    onSeriesComplete?.(exercise);
  }, [timed, timerState, timeLeft, exercise?.id]);

  if (!exercise) return null;

  const advance = () => {
    if (index < exercises.length - 1) {
      setIndex((value) => value + 1);
      setSetNumber(1);
      setTimeLeft(0);
      setTimerState("idle");
    } else {
      onExit();
    }
  };
  const completeSet = () => {
    onSeriesComplete?.(exercise);
    if (setNumber < totalSets) setSetNumber((value) => value + 1);
    else advance();
  };
  const startTimer = () => {
    setTimeLeft(durationSeconds);
    setTimerState("running");
  };
  const distanceBased = new RegExp("\\b\\d+\\s*m\\b", "i").test(String(repsFor(exercise) || ""));

  return (
    <div className="guided-workout-backdrop" role="dialog" aria-modal="true">
      <div className="guided-workout">
        <div className="guided-head">
          <div>
            <span className="eyebrow">TREINO GUIADO · {index + 1}/{exercises.length}</span>
            <h2>{translateExerciseName(exercise.name, language)}</h2>
          </div>
          <button className="outline" type="button" onClick={onExit}>Sair ×</button>
        </div>
        <div className="guided-media">
          <ExerciseGif exercise={exercise} variant="guided" />
        </div>
        <div className="guided-meta">
          {timed ? (
            <>
              <span className="pill">TEMPO CONTÍNUO</span>
              <span className="pill">{formatExerciseDuration(durationSeconds)}</span>
            </>
          ) : (
            <>
              <span className="pill">SÉRIE {setNumber} DE {totalSets}</span>
              <span className="pill">{distanceBased ? "Distância: " + repsFor(exercise) : repsFor(exercise) + " repetições"}</span>
            </>
          )}
          <span className="pill">{equipmentLabel(exercise)}</span>
        </div>
        {timed && (
          <div className="interval-display" aria-live="assertive">
            <span>{timerState === "done" ? "Tempo concluído" : timerState === "running" ? "Tempo restante" : timerState === "paused" ? "Temporizador pausado" : "Duração prevista"}</span>
            <strong>{formatCountdown(timerState === "idle" ? durationSeconds : timeLeft)}</strong>
            <small>Faça o movimento de forma contínua, sem dividir em séries.</small>
          </div>
        )}
        <div className="guided-instructions">
          <h3>Como executar</h3>
          <ol>
            {instructions.length ? (
              instructions.map((step, i) => <li key={i}>{step}</li>)
            ) : (
              <li>Faça o movimento devagar, com postura controlada e sem dor.</li>
            )}
          </ol>
        </div>
        <div className="guided-actions">
          {timed ? (
            <>
              {timerState === "idle" && <button className="primary" type="button" onClick={startTimer}>Iniciar {formatExerciseDuration(durationSeconds)}</button>}
              {timerState === "running" && <button className="outline" type="button" onClick={() => setTimerState("paused")}>Pausar temporizador</button>}
              {timerState === "paused" && <button className="primary" type="button" onClick={() => setTimerState("running")}>Retomar temporizador</button>}
              {timerState === "done" && <button className="primary" type="button" onClick={advance}>{index < exercises.length - 1 ? "Próximo exercício" : "Concluir treino"}</button>}
            </>
          ) : (
            <button className="primary" type="button" onClick={completeSet}>
              {setNumber < totalSets
                ? "Concluir série " + setNumber
                : index < exercises.length - 1
                  ? "Concluir e próximo exercício"
                  : "Concluir treino"}
            </button>
          )}
          <small>{timed ? "O temporizador conta o tempo de execução contínua." : "Avanço automático após completar as séries deste exercício."}</small>
        </div>
      </div>
    </div>
  );
}

const ageFor = (profile) => ageFromProfile(profile);
const loadRecommendation = (profile, exercise) => {
  const age = ageFor(profile),
    weight = Number(profile?.current_weight) || 70,
    level = profile?.training_level || "beginner";
  if (isTimedExercise(exercise))
    return formatExerciseDuration(exercise.duration_seconds || exercise.work_seconds || 60) + " contínuos";
  if (age < 18)
    return "Priorize técnica supervisionada e progressão gradual; sem teste de carga máxima";
  if (/sem equipamento|bodyweight/i.test(exercise?.equipment || ""))
    return "Peso corporal · técnica controlada";
  const factor =
    age >= 60
      ? 0.04
      : level === "advanced"
        ? 0.12
        : level === "intermediate"
          ? 0.08
          : 0.05;
  return `Sugestão inicial: ${Math.max(1, Math.round(weight * factor))} kg total · ajuste sem dor`;
};
export function Workouts({ plan }) {
  const {
    data,
    exerciseLibrary = [],
    ensureExerciseLibrary,
    userId,
    mutate,
    busy,
    profile,
  } = useStore();
  const trainingLogs = (data.training_logs || []).filter(
    (log) => log.user_id === userId,
  );
  const userNutritionLogs = (data.daily_nutrition_logs || []).filter(
    (log) => log.user_id === userId,
  );
  const accountTracking = accountDayStatuses(profile.created_at, trainingLogs, userNutritionLogs, new Date(), profile);
  const [completed, setCompleted] = useState({}),
    [guided, setGuided] = useState(false),
    [timer, setTimer] = useState(0),
    [timerNonce, setTimerNonce] = useState(0),
    [saved, setSaved] = useState(false),
    [logId, setLogId] = useState(() => crypto.randomUUID()),
    [equipment, setEquipment] = useState(
      ["boxe", "karate"].includes(modalityKeyFor(profile))
        ? "Sem equipamento"
        : profile.training_location === "ginasio" ? "Com equipamento" : "Sem equipamento",
    ),
    [place, setPlace] = useState(profile.training_location === "ginasio" ? "ginasio" : "casa"),
    [previewExercise, setPreviewExercise] = useState(null),
    [substitutions, setSubstitutions] = useState({}),
    [programDay, setProgramDay] = useState(() => Math.min(30, accountDayNumber(profile.created_at))),
    [intensity, setIntensity] = useState("moderate"),
    [libraryLimit, setLibraryLimit] = useState(12);
  const [language] = useLanguage();
  const t = (value) => translateUiText(value, language);
  useEffect(() => {
    if (profile.created_at && programDay === 1) {
      setProgramDay(Math.min(30, accountDayNumber(profile.created_at)));
    }
  }, [profile.created_at]);
  useEffect(() => {
    const idle =
      window.requestIdleCallback || ((callback) => setTimeout(callback, 350));
    const task = idle(() => ensureExerciseLibrary?.());
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(task);
      else clearTimeout(task);
    };
  }, [ensureExerciseLibrary]);
  const allAvailable = (data.workouts || []).filter((workout) => {
    const linkedModality = (data.modalities || []).find((item) => item.id === workout.modality_id)?.name || "";
    const descriptor = `${workout.title || ""} ${workout.description || ""} ${linkedModality}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return workout.active !== false && (!workout.user_id || workout.user_id === userId) &&
      !["futsal", "natacao", "swimming", "soccer", "football"].some((term) => descriptor.includes(term));
  });
  const personalized = allAvailable.filter((workout) => {
    const modality = (data.modalities || []).find(
      (item) => item.id === workout.modality_id,
    );
    return !profile.modality || !modality || modality.name === profile.modality;
  });
  const workout = personalized[0] || allAvailable[0] || null;
  const allExercises = useMemo(
    () =>
      [...exerciseLibrary, ...(data.exercises || [])]
        .filter(
          (exercise, index, list) =>
            exercise?.id &&
            !list
              .slice(0, index)
              .some((previous) => previous.id === exercise.id),
        )
        .filter((exercise) => !isRemovedModalityExercise(exercise))
        .filter((exercise) => suitableForProfile(exercise, profile)),
    [exerciseLibrary, data.exercises, profile.age, profile.birth_date, profile.training_level, profile.goal],
  );
  const bmi =
    profile.current_weight && profile.height
      ? Number(profile.current_weight) / (Number(profile.height) / 100) ** 2
      : null;
  const modalityKey = modalityKeyFor(profile);
  const goalKey = exerciseGoalKeyFor(profile);
  const age = ageFor(profile);
  const isMartialArts = ["boxe", "karate"].includes(modalityKey);
  const programEquipment = isMartialArts
    ? "Sem equipamento"
    : equipment ||
      (place === "casa"
        ? "Sem equipamento"
        : place === "ginasio"
          ? "Com equipamento"
          : "");
  const selectedEquipmentMode = normalizeEquipmentSelection(programEquipment);
  const program = useMemo(
    () =>
      build30DayPlan(
        allExercises,
        goalKey,
        profile.training_level || "beginner",
        intensity,
        programEquipment,
        profile,
      ),
    [
      allExercises,
      goalKey,
      profile.training_level,
      intensity,
      programEquipment,
      profile.birth_date,
      profile.age,
      profile.training_location,
      profile.training_days_count,
      profile.training_frequency,
      modalityKey,
      profile.goal,
    ],
  );
  const today = program[programDay - 1] || program[0];
  const baseExercises = (today?.exercises || []).filter(
    (exercise) => (exercise.min_tier || 0) <= (plan?.tier || 0),
  );
  const exercises = baseExercises.map(
    (exercise) => substitutions[exercise.id] || exercise,
  );
  const substituteExercise = (exercise) => {
    const used = new Set(exercises.map((item) => item.id));
    const replacement = allExercises.find(
      (item) =>
        !used.has(item.id) &&
        samePrimaryMuscle(exercise, item) &&
        suitableForProfile(item, profile) &&
        (selectedEquipmentMode === "all" ||
          exerciseEquipmentMode(item) === selectedEquipmentMode),
    );
    if (replacement)
      setSubstitutions((current) => ({
        ...current,
        [exercise.id]: replacement,
      }));
  };
  useEffect(() => {
    exercises.slice(0, 2).forEach((exercise) => {
      const src = exercise?.image_path || exercise?.gifUrl;
      if (src) {
        const image = new Image();
        image.src = src;
      }
    });
  }, [exercises.map((e) => e.id).join("|")]);

  const libraryExercises = useMemo(
    () =>
      allExercises
        .filter((exercise) => (exercise.min_tier || 0) <= (plan?.tier || 0))
        .filter(
          (exercise) =>
            selectedEquipmentMode === "all" ||
            exerciseEquipmentMode(exercise) === selectedEquipmentMode,
        ),
    [allExercises, plan?.tier, selectedEquipmentMode],
  );
  const modalityName = String(profile.modality || "").toLowerCase();
  const modalityDefaultSets = 3;
  const setsFor = (exercise) => {
    if (isTimedExercise(exercise)) return 1;
    const base = Number(exercise.sets) || modalityDefaultSets;
    return age >= 60 ? Math.min(2, base) : base;
  };
  const durationFor = (exercise) =>
    Number(exercise.duration_seconds || exerciseDurationSeconds(exercise, profile, intensity)) || 60;
  const durationLabelFor = (exercise) => formatExerciseDuration(durationFor(exercise));
  const repsFor = (exercise) => {
    if (exercise.reps) return exercise.reps;
    if (modalityName.includes("calisten")) return "6–10";
    return "8–12";
  };
  const total = exercises.reduce((sum, exercise) => sum + setsFor(exercise), 0);
  const count = exercises.reduce(
    (sum, exercise) =>
      sum + Math.min(completed[exercise.id] || 0, setsFor(exercise)),
    0,
  );
  const equipmentTitle =
    selectedEquipmentMode === "bodyweight"
      ? "Sem equipamento"
      : selectedEquipmentMode === "equipment"
        ? "Com equipamento"
        : "Todos os equipamentos";
  const programKey = `${modalityKey}:${goalKey}`;
  const completedDay = trainingLogs.some((log) => {
    if (Number(log.loads?.program_day) !== programDay) return false;
    if (String(log.loads?.equipment || "") !== String(equipmentTitle)) return false;
    const savedModality = String(log.loads?.modality || "");
    const savedGoal = String(log.loads?.goal || "");
    const isCurrentFormat = log.program_modality === programKey
      && savedModality === modalityKey
      && savedGoal === goalKey;
    const isLegacyFormat = !savedGoal && (
      (log.program_modality === goalKey && savedModality === goalKey)
      || (log.program_modality === modalityKey && savedModality === modalityKey)
    );
    return isCurrentFormat || isLegacyFormat;
  });

  const reset = () => {
    setCompleted({});
    setSaved(false);
    setLogId(crypto.randomUUID());
    setTimer(0);
    setTimerNonce((value) => value + 1);
    setLibraryLimit(12);
  };
  return (
    <>
      <Title title="Meus treinos" tag={profile.modality || "SEU PROGRAMA"} />
      <section className="program-panel">
        <div>
          <span className="eyebrow">{translateUiText("PROGRAMA PERSONALIZADO", language)}</span>
          <h2>{translateUiText("30 dias de evolução", language)}</h2>
          <p>
            {translateUiText(today?.focus || "Treino guiado", language)} · {translateUiText(profile.modality || modalityKey, language)} ·{" "}
            {translateUiText(equipmentTitle, language)}
          </p>
          <div className="program-focus-tags">
            {(today?.groups || []).map((group) => (
              <span key={group}>
                {translateUiText(group
                  .replace("chest", "peito")
                  .replace("triceps", "tríceps")
                  .replace("back", "costas")
                  .replace("biceps", "bíceps")
                  .replace("legs", "pernas")
                  .replace("glutes", "glúteos")
                  .replace("cardio", "cardio")
                  .replace("core", "abdômen")
                  .replace("shoulders", "ombros")
                  .replace("mobility", "mobilidade"), language)}
              </span>
            ))}
          </div>
        </div>
        <div className="program-choice-block">
          <span className="choice-label">{translateUiText("Escolha o dia", language)}</span>
          <div className="day-picker">
            {program.map((day) => (
              <button
                type="button"
                className={`day-chip ${programDay === day.day ? "active" : ""} ${accountTracking.days[day.day - 1]?.workoutMissed ? "missed" : accountTracking.days[day.day - 1]?.workoutDone ? "done" : ""}`}
                key={day.day}
                title={translateUiText(accountTracking.days[day.day - 1]?.workoutMissed ? "Treino perdido" : accountTracking.days[day.day - 1]?.workoutDone ? "Treino concluído" : "Dia por cumprir", language)}
                onClick={() => {
                  setProgramDay(day.day);
                  reset();
                }}
              >
                <strong>{day.day}</strong>
                <small>{accountTracking.days[day.day - 1]?.workoutMissed ? translateUiText("Perdido", language) : translateUiText(day.focus, language)}</small>
              </button>
            ))}
          </div>
          <p className="nutrition-calendar-note">{translateUiText("Verde: treino registado. Vermelho: dia terminado sem treino guardado.", language)}</p>
        </div>
        <div className="program-choice-block difficulty-choice">
          <span className="choice-label">{translateUiText("Dificuldade", language)}</span>
          <div className="choice-pills">
            {Object.entries(intensityLabels).filter(([value]) => !(age >= 12 && age < 18 && value === "hard")).map(([value, label]) => (
              <button
                type="button"
                className={intensity === value ? "active" : ""}
                key={value}
                onClick={() => {
                  setIntensity(value);
                  setProgramDay(1);
                  reset();
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="program-progress">
          <span style={{ width: `${(programDay / 30) * 100}%` }} />
        </div>
      </section>
      {completedDay && (
        <div className="completed-day-notice">
          ✓ Dia {programDay} já concluído. Este dia fica bloqueado para evitar
          repetir o registro. Escolha outro dia para continuar.
        </div>
      )}
      <div className={`intensity-note intensity-${intensity}`}>
        <b>{translateUiText(intensityLabels[intensity], language)}</b> · {translateUiText(intensityNotes[intensity], language)}
      </div>
      {(today?.progressionNote || today?.skillNote) && (
        <div className="cal-plan-note">
          {today.progressionNote && <p><b>{translateUiText("Progressão do dia:", language)}</b> {today.progressionNote}</p>}
          {today.skillNote && <p><b>{translateUiText("Meta técnica:", language)}</b> {today.skillNote}</p>}
        </div>
      )}
      <section className="exercise-showcase">
        <div className="showcase-heading">
          <div>
            <span className="eyebrow">{translateUiText("MOVIMENTOS DO DIA", language)}</span>
            <h2>{translateUiText(today?.title || "Treino guiado", language)}</h2>
            <p>
              {translateUiText(today?.sessionLabel || today?.focus || "Movimentos reais", language)} · {language === "pt" ? "Dia" : language === "en" ? "Day" : language === "fr" ? "Jour" : language === "es" ? "Día" : language === "zh" ? "第" : "दिन"}{" "}
              {programDay} de 30 · {intensityLabels[intensity]}
            </p>
          </div>
          <span className="showcase-mode">{equipmentTitle}</span>
        </div>
        <p className="showcase-confirmation">
          Os exercícios abaixo são exclusivos da modalidade e do foco deste dia.
          Ao trocar o equipamento, o foco continua igual e só mudam os
          movimentos compatíveis.
        </p>
        {exercises.length ? (
          <div className="showcase-grid">
            {exercises.map((exercise) => (
              <article className="showcase-card" key={exercise.id}>
                <button
                  type="button"
                  className="showcase-media-button"
                  onClick={() => setPreviewExercise(exercise)}
                  aria-label={`${translateUiText("Ver demonstração", language)}: ${translateExerciseName(exercise.name, language)}`}
                >
                  <ExerciseGif exercise={exercise} variant="showcase" />
                </button>
                <div className="showcase-card-copy">
                  <b>{translateExerciseName(exercise.name, language)}</b>
                  <small>
                    {muscleLabel(exercise)} · {equipmentLabel(exercise)}
                  </small>
                  <button
                    type="button"
                    className="exercise-info-button"
                    onClick={() => setPreviewExercise(exercise)}
                  >
                    <span>ⓘ</span> Como executar
                  </button>
                  <button
                    type="button"
                    className="exercise-swap-button"
                    onClick={() => substituteExercise(exercise)}
                  >
                    Não consigo fazer · trocar
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Empty>
            Não encontramos GIFs compatíveis com este foco e equipamento.
            Escolha outra opção para continuar.
          </Empty>
        )}
      </section>
      <div className="workout-mode-toggle">
        <button type="button" className="primary small" onClick={() => setGuided(true)}>
          ▶ Começar treino guiado
        </button>
      </div>
      {guided && (
        <GuidedWorkout
          exercises={exercises}
          setsFor={setsFor}
          repsFor={repsFor}
          durationFor={durationFor}
          isTimedFor={isTimedExercise}
          language={language}
          onSeriesComplete={(exercise) =>
            setCompleted((current) => ({
              ...current,
              [exercise.id]: Math.min((current[exercise.id] || 0) + 1, setsFor(exercise)),
            }))
          }
          onExit={() => setGuided(false)}
        />
      )}
      <div className="filter-row">
        <label>
          Local
          <select
            value={place}
            onChange={(event) => {
              const value = event.target.value;
              setPlace(value);
              setEquipment(
                value === "casa"
                  ? "Sem equipamento"
                  : value === "ginasio"
                    ? "Com equipamento"
                    : "",
              );
              reset();
            }}
          >
            <option value="ginasio">{translateUiText("Gym", language)}</option>
            <option value="casa">{translateUiText("Home", language)}</option>
          </select>
        </label>
        <label>
          Equipamento
          <select
            value={isMartialArts ? "Sem equipamento" : equipment}
            disabled={isMartialArts}
            onChange={(event) => {
              setEquipment(event.target.value);
              reset();
            }}
          >
            <option value="">Todos</option>
            <option>Sem equipamento</option>
            <option>Com equipamento</option>
          </select>
        </label>
      </div>
      <div className="workout-banner">
        <div>
          <span className="pill">
            {count} / {total} ETAPAS CONCLUÍDAS
          </span>
          <h2>{today?.title || "Treino guiado"}</h2>
          <p>
            {today?.sessionLabel ||
              workout?.description ||
              "Programa de 30 dias com movimentos selecionados para a modalidade."}
          </p>
        </div>
        <div className="timer" aria-live="polite">
          <RestClock
            seconds={timer}
            nonce={timerNonce}
            onClear={() => setTimer(0)}
          />
        </div>
      </div>
      {exercises.map((exercise) => (
        <article key={exercise.id} className="exercise-detail">
          <div className="exercise-copy">
            <button
              className="exercise-media exercise-preview-trigger"
              type="button"
              onClick={() => setPreviewExercise(exercise)}
              title="Ver como executar este exercício"
            >
              <ExerciseGif exercise={exercise} variant="detail" />
            </button>
            <div>
              <span className="pill">{exercise.category || "Movimento"}</span>
              <h3>{translateExerciseName(exercise.name, language)}</h3>
              <p>
                Faça este movimento devagar, com postura controlada, amplitude
                confortável e sem dor.
              </p>
              <small>
                {equipmentLabel(exercise)} · trabalha: {muscleLabel(exercise)} ·{" "}
                {isTimedExercise(exercise)
                  ? durationLabelFor(exercise) + " contínuos, sem séries"
                  : loadRecommendation(profile, exercise) + " · " + setsFor(exercise) + " séries de " + repsFor(exercise) + " · pausa " + (exercise.rest_seconds || 60) + "s"}
              </small>
            </div>
          </div>
          <div className="exercise-controls">
            <button
              type="button"
              className="outline exercise-swap-button"
              onClick={() => substituteExercise(exercise)}
            >
              Trocar por outro do mesmo músculo
            </button>
            <button
              className="primary small"
              disabled={
                completedDay ||
                saved ||
                (completed[exercise.id] || 0) >= setsFor(exercise)
              }
              onClick={() => {
                setCompleted((current) => ({
                  ...current,
                  [exercise.id]: Math.min((current[exercise.id] || 0) + 1, setsFor(exercise)),
                }));
                if (!isTimedExercise(exercise)) {
                  setTimer(exercise.rest_seconds || 60);
                  setTimerNonce((value) => value + 1);
                }
              }}
            >
              {completed[exercise.id] || 0}/{setsFor(exercise)} · {isTimedExercise(exercise) ? "Concluir exercício" : "Concluir série"}
            </button>
          </div>
        </article>
      ))}
      {exercises.length > 0 && (
        <form
          id="workout-log"
          onSubmit={async (event) => {
            event.preventDefault();
            const fields = Object.fromEntries(
              new FormData(event.currentTarget),
            );
            if (
              await mutate("training_logs", {
                id: logId,
                user_id: userId,
                workout_id: workout?.id || null,
                workout_name: `Dia ${programDay} · ${today?.focus || "Treino guiado"} · ${intensityLabels[intensity]} · ${equipmentTitle}`,
                completed_at: new Date().toISOString(),
                local_date: localDateKey(new Date()),
                program_day: programDay,
                program_modality: programKey,
                equipment_mode: equipmentTitle,
                notes: fields.notes || "",
                loads: {
                  ...fields,
                  program_day: programDay,
                  intensity,
                  equipment: equipmentTitle,
                  modality: modalityKey,
                  goal: goalKey,
                },
              })
            )
              setSaved(true);
          }}
        >
          <section className="workout-feedback">
            <div className="feedback-heading">
              <span className="feedback-orb">✦</span>
              <div>
                <b>Como você se sente depois do treino?</b>
                <small>
                  Seu registro ajuda a acompanhar energia, esforço e
                  recuperação.
                </small>
              </div>
            </div>
            <div className="feedback-moods">
              <label>
                <input
                  type="radio"
                  name="feeling"
                  value="excelente"
                  defaultChecked
                />
                <span>
                  ⚡<small>Excelente</small>
                </span>
              </label>
              <label>
                <input type="radio" name="feeling" value="bem" />
                <span>
                  🙂<small>Bem</small>
                </span>
              </label>
              <label>
                <input type="radio" name="feeling" value="cansado" />
                <span>
                  😮‍💨<small>Cansado</small>
                </span>
              </label>
              <label>
                <input type="radio" name="feeling" value="dor" />
                <span>
                  🫤<small>Com desconforto</small>
                </span>
              </label>
            </div>
            <label className="feedback-note">
              <span>Observação opcional</span>
              <textarea
                name="notes"
                maxLength="2000"
                placeholder="Conte como foi: energia, dificuldade, carga ou qualquer desconforto…"
              />
            </label>
          </section>
          <button
            className="primary"
            disabled={busy || completedDay || saved || !total || count < total}
          >
            {saved ? "Treino registrado ✓" : "Concluir e registrar treino"}
          </button>
        </form>
      )}
      {previewExercise && (
        <div
          className="exercise-preview-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${translateUiText("Pré-visualização de", language)} ${translateExerciseName(previewExercise.name, language)}`}
        >
          <div className="exercise-preview-card">
            <div className="exercise-preview-head">
              <div>
                <span className="pill">PRÉ-VISUALIZAÇÃO</span>
                <h2>{translateExerciseName(previewExercise.name, language)}</h2>
              </div>
              <button
                className="outline"
                type="button"
                onClick={() => setPreviewExercise(null)}
              >
                Fechar ×
              </button>
            </div>
            <ExerciseGif exercise={previewExercise} variant="preview" />
            <div className="exercise-preview-info">
              <p>
                <b>Como executar:</b> Faça este movimento devagar, com postura
                controlada, amplitude confortável e sem dor.
              </p>
              <p>
                <b>Músculo principal:</b> {muscleLabel(previewExercise)} ·{" "}
                <b>Equipamento:</b> {equipmentLabel(previewExercise)}
              </p>
              {Array.isArray(previewExercise.instructions) && (
                <ol>
                  {translatedInstructions(previewExercise, language).map(
                    (step, index) => (
                      <li key={index}>{step}</li>
                    ),
                  )}
                </ol>
              )}
              <small>
                Se sentir dor aguda, tontura ou falta de ar incomum, pare e
                procure orientação profissional.
              </small>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Progress({ metrics }) {
  const { data, userId, mutate, busy, setError, refresh, profile } = useStore();
  const [language] = useLanguage();
  const t = (value) => translateUiText(value, language);
  const dateLocale = ({ pt: "pt-MZ", en: "en-US", fr: "fr-FR", es: "es-ES", zh: "zh-CN", hi: "hi-IN" })[language] || "pt-MZ";
  const [form, setForm] = useState(false);
  const [photo, setPhoto] = useState("");
  const [photoUrls, setPhotoUrls] = useState({});
  const userPhotos = (data.progress_photos || [])
    .filter((item) => item.user_id === userId)
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  const photoKey = userPhotos.map((item) => item.id + ":" + item.path).join("|");
  useEffect(() => {
    let alive = true;
    if (!userPhotos.length) { setPhotoUrls({}); return () => { alive = false; }; }
    Promise.all(userPhotos.map(async (item) => {
      try { return [item.id, await openMedia("progress-photos", item.path, 3600)]; }
      catch { return [item.id, null]; }
    })).then((entries) => {
      if (alive) setPhotoUrls(Object.fromEntries(entries.filter(([, url]) => url)));
    });
    return () => { alive = false; };
  }, [photoKey, userId]);
  const allLogs = (data.training_logs || []).filter((log) => log.user_id === userId);
  const nutritionLogs = (data.daily_nutrition_logs || []).filter((log) => log.user_id === userId);
  const accountTracking = accountDayStatuses(profile.created_at, allLogs, nutritionLogs, new Date(), profile);
  const missedWorkoutDays = accountTracking.missedWorkoutDays;
  const missedNutritionDays = accountTracking.missedNutritionDays;
  const finalPhotoPattern = /(?:dia\s*30|foto\s*final|after)/i;
  const initialPhotoPattern = /(?:dia\s*0|foto\s*inicial|antes)/i;
  const firstPhoto = userPhotos.filter((item) => initialPhotoPattern.test(String(item.note || ""))).at(-1)
    || userPhotos.find((item) => !finalPhotoPattern.test(String(item.note || "")))
    || null;
  const afterPhoto = userPhotos.filter((item) => finalPhotoPattern.test(String(item.note || ""))).at(-1) || null;
  const currentWeight = metrics.current ?? (profile.current_weight ? Number(profile.current_weight) : null);
  const saveProgressPhoto = async (event, stage) => {
    event.preventDefault();
    if (stage === "after" && !canUploadAfter) {
      setError(t("A foto final só fica disponível depois de completar os 30 dias do programa."));
      return;
    }
    const formElement = event.currentTarget;
    const fields = new FormData(formElement);
    const file = fields.get("photo");
    if (!(file instanceof File) || !file.size) {
      setError(t("Escolha uma fotografia antes de guardar."));
      return;
    }
    let path = "";
    try {
      path = await upload("progress-photos", file, userId);
      const note = stage === "before" ? "Foto inicial · Dia 0" : "Foto final · Dia 30";
      const ok = await mutate("progress_photos", { user_id: userId, path, note });
      if (ok) {
        formElement.reset();
        await refresh?.();
      } else if (path) {
        await supabase.storage.from("progress-photos").remove([path]);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <Title tag="SUA JORNADA EM NÚMEROS" title="Minha evolução">
        <button type="button" className="primary small" onClick={() => setForm((value) => !value)}>{t("+ Registrar medida")}</button>
      </Title>
      <div className="grid stats">
        <Stat label="Peso atual" value={currentWeight === null ? "—" : currentWeight + " kg"} />
        <Stat label="Treinos registados" value={metrics.total} />
        <Stat label="Treinos perdidos" value={missedWorkoutDays} />
        <Stat label="Dias de alimentação perdidos" value={missedNutritionDays} />
        <Stat label="Sequência" value={metrics.streak + " dias"} />
        <Stat label="Variação" value={metrics.delta === null ? "—" : metrics.delta.toFixed(1) + " kg"} />
      </div>
      {form && (
        <form className="panel-form progress-measure-form" onSubmit={async (event) => {
          event.preventDefault();
          const fields = Object.fromEntries(new FormData(event.currentTarget));
          const payload = Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== ""));
          const weight = payload.weight ? Number(payload.weight) : null;
          const ok = await mutate("progress_measurements", { ...payload, weight, user_id: userId });
          if (ok) {
            if (weight) await mutate("profiles", { current_weight: weight, initial_weight: Number(profile.initial_weight) || weight }, userId);
            setForm(false);
          }
        }}>
          <div className="form-grid">
            <Field label="Data" name="measured_at" type="date" required defaultValue={new Date().toLocaleDateString("en-CA")} />
            <Field label="Peso (kg)" name="weight" type="number" min="20" max="400" step="0.1" required defaultValue={profile.current_weight || ""} />
            {["arm", "chest", "waist", "hip", "thigh"].map((name, index) => <Field key={name} label={["Braço (cm)", "Peito (cm)", "Cintura (cm)", "Quadril (cm)", "Coxa (cm)"][index]} name={name} type="number" min="1" max="300" step="0.1" />)}
          </div>
          <button className="primary" disabled={busy}>Guardar medida e atualizar peso</button>
        </form>
      )}
      <section className="progress-photo-section">
        <div className="progress-photo-heading">
          <div><span className="eyebrow">{t("COMPARAÇÃO VISUAL")}</span><h2>{t("Antes e depois")}</h2></div>
          <span className="pill">{t("PRIVADO")}</span>
        </div>
        <p className="muted">{t("Guarde a foto inicial no começo do plano. A foto final será liberada depois de completar os 30 dias do programa.")}</p>
        <div className="progress-before-after">
          <article className="progress-photo-slot">
            <span>{t("ANTES · DIA 0")}</span>
            {firstPhoto ? (
              photoUrls[firstPhoto.id] ? (
                <button type="button" className="progress-photo-preview" onClick={() => setPhoto(photoUrls[firstPhoto.id])}>
                  <img src={photoUrls[firstPhoto.id]} alt="Fotografia inicial de progresso, corpo inteiro" />
                </button>
              ) : <div className="progress-photo-placeholder">{t("A carregar foto inicial…")}</div>
            ) : <div className="progress-photo-placeholder">{t("Ainda sem foto inicial")}</div>}
            <small>{firstPhoto ? new Date(firstPhoto.created_at).toLocaleDateString(dateLocale) : t("Dia 0")}</small>
            <form className="panel-form progress-photo-upload" onSubmit={(event) => saveProgressPhoto(event, "before")}>
              <label className="file-drop">
                <span>{t(firstPhoto ? "Selecionar outra foto inicial" : "Selecionar foto inicial")}</span>
                <small>{t("JPG, PNG ou WebP · até 10 MB")}</small>
                <input name="photo" type="file" required accept="image/jpeg,image/png,image/webp" capture="user" />
              </label>
              <label className="checkbox"><input type="checkbox" required />{t("Autorizo guardar esta foto privada.")}</label>
              <button className="primary" disabled={busy}>{t(firstPhoto ? "Atualizar foto inicial" : "Guardar foto inicial")}</button>
            </form>
          </article>
          <article className="progress-photo-slot">
            <span>{t("DEPOIS · DIA 30")}</span>
            {afterPhoto ? (
              photoUrls[afterPhoto.id] ? (
                <button type="button" className="progress-photo-preview" onClick={() => setPhoto(photoUrls[afterPhoto.id])}>
                  <img src={photoUrls[afterPhoto.id]} alt="Fotografia final de progresso após 30 dias, corpo inteiro" />
                </button>
              ) : <div className="progress-photo-placeholder">{t("A carregar foto final…")}</div>
            ) : (
              <div className="progress-photo-placeholder">
                {!canUploadAfter
                  ? `Disponível ao completar 30 dias (${elapsedDays}/30)`
                  : "Pronta para receber a foto final"}
              </div>
            )}
            <small>{afterPhoto ? new Date(afterPhoto.created_at).toLocaleDateString(dateLocale) : t("Dia 30")}</small>
            <form className="panel-form progress-photo-upload" onSubmit={(event) => saveProgressPhoto(event, "after")}>
              <label className="file-drop">
                <span>{t(afterPhoto ? "Selecionar outra foto final" : "Selecionar foto final")}</span>
                <small>{canUploadAfter ? t("JPG, PNG ou WebP · até 10 MB") : t("Disponível depois dos 30 dias do programa")}</small>
                <input name="photo" type="file" required accept="image/jpeg,image/png,image/webp" capture="user" disabled={!canUploadAfter} />
              </label>
              <label className="checkbox"><input type="checkbox" required disabled={!canUploadAfter} />{t("Autorizo guardar esta foto privada.")}</label>
              <button className="primary" disabled={busy || !canUploadAfter}>{t(afterPhoto ? "Atualizar foto final" : "Guardar foto final")}</button>
            </form>
          </article>
        </div>
      </section>
      {photo && <div className="progress-photo-lightbox" role="dialog" aria-modal="true" onClick={() => setPhoto("")}><button type="button" aria-label={t("Fechar foto")}>×</button><img src={photo} alt={t("Fotografia de progresso ampliada")} /></div>}
    </>
  );
}

export function Profile({ theme, onThemeChange }) {
  const { profile, userId, session, data, mutate, busy, isDemo, setError } =
    useStore();
  const [notice, setNotice] = useState(""),
    [avatarPreview, setAvatarPreview] = useState("");
  const [language, setLanguage] = useLanguage();
  const t = (value) => translateUiText(value, language);
  const storedGoal = String(profile.goal || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const goalValue = storedGoal.includes("emagrec") ? "emagrecimento"
    : storedGoal.includes("defini") || storedGoal.includes("cut") ? "definicao"
      : storedGoal.includes("bulking") || storedGoal.includes("massa") || storedGoal.includes("ganho") ? "bulking"
        : storedGoal.includes("muscul") ? "musculacao"
          : storedGoal.includes("manut") || storedGoal.includes("recompos") ? "manutencao"
          : "condicionamento";
  const storedModality = String(profile.modality || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const modalityValue = storedModality.includes("calisten") ? "Calistenia"
    : storedModality.includes("box") ? "Boxe"
      : storedModality.includes("karate") ? "Karatê"
        : "Musculação";
  return (
    <>
      <Title tag="SEUS DADOS" title="Meu perfil" />
      <form
        className="panel-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(e.currentTarget));
          const selectedTrainingDays = Array.from(
            e.currentTarget.elements.training_days?.selectedOptions || [],
          ).map((option) => option.value);
          const trainingDaysCount = selectedTrainingDays.length || Number(f.training_frequency) || Number(profile.training_days_count) || 3;
          const trainingLocation = f.training_location || profile.training_location || "casa";
          if (
            await mutate(
              "profiles",
              {
                ...f,
                height: f.height ? Number(f.height) : null,
                household_size: f.household_size ? Number(f.household_size) : 1,
                training_frequency: trainingDaysCount,
                training_days_count: trainingDaysCount,
                training_location: trainingLocation,
                current_weight: f.current_weight ? Number(f.current_weight) : profile.current_weight,
                target_weight: f.target_weight ? Number(f.target_weight) : null,
                initial_weight: f.initial_weight ? Number(f.initial_weight) : profile.initial_weight,
                age: f.birth_date ? (() => { const birth = new Date(f.birth_date + "T00:00:00"); const today = new Date(); let years = today.getFullYear() - birth.getFullYear(); if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) years -= 1; return years; })() : profile.age,
                equipment_preference: trainingLocation === "ginasio" ? "Com equipamento" : "Sem equipamento",
                supplements: String(f.supplements || "").split(",").map((value) => value.trim()).filter(Boolean),
                food_dislikes: f.foods_to_avoid || "",
                training_days: selectedTrainingDays,
                reminders_enabled: f.reminders_enabled === "on",
                reminder_types: Array.from(
                  e.currentTarget.querySelectorAll(
                    'input[name="reminder_types"]:checked',
                  ),
                ).map((input) => input.value),
              },
              userId,
            )
          )
            setNotice(t("Perfil atualizado."));
        }}
      >
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            {avatarPreview ? (
              <img src={avatarPreview} alt={t("Foto de perfil")} />
            ) : (
              <CommunityAvatar person={profile} />
            )}
          </div>
          <div>
            <h2>{profile.full_name}</h2>
            <p>{session?.user.email || "Prévia sem conta"}</p>
          </div>
        </div>
        <div className="form-grid">
          <Field
            label="Nome completo"
            name="full_name"
            required
            defaultValue={profile.full_name}
          />
          <Field
            label="Telefone"
            name="phone"
            defaultValue={profile.phone || ""}
          />
          <Field
            label="Altura (cm)"
            name="height"
            type="number"
            min="120"
            max="230"
            defaultValue={profile.height || ""}
          />
          <Field
            label="Peso atual (kg)"
            name="current_weight"
            type="number"
            min="25"
            max="300"
            step="0.1"
            defaultValue={profile.current_weight || ""}
          />
          <Field
            label="Peso objetivo (kg)"
            name="target_weight"
            type="number"
            min="25"
            max="300"
            step="0.1"
            defaultValue={profile.target_weight || ""}
          />
          <details className="profile-advanced">
            <summary>
              <span><small>{t("DADOS OPCIONAIS")}</small><b>{t("Rotina de treino e lembretes")}</b></span>
              <span className="profile-advanced-hint">{t("Ajustar")}</span>
            </summary>
          <label>
            {t("Sexo")}
            <select name="sex" defaultValue={profile.sex || ""}>
              <option value="">{t("Prefiro não informar")}</option>
              <option value="feminino">{t("Feminino")}</option>
              <option value="masculino">{t("Masculino")}</option>
            </select>
          </label>
          <label>
            {t("Nível")}
            <select
              name="training_level"
              defaultValue={profile.training_level || "beginner"}
            >
              <option value="beginner">{t("Iniciante")}</option>
              <option value="intermediate">{t("Intermédio")}</option>
              <option value="advanced">{t("Avançado")}</option>
            </select>
          </label>
          <label>
            {t("Modalidade")}
            <select name="modality" defaultValue={modalityValue}>
              <option value="Musculação">{t("Musculação")}</option>
              <option value="Calistenia">{t("Calistenia")}</option>
              <option value="Boxe">{t("Boxe")}</option>
              <option value="Karatê">{t("Karatê")}</option>
            </select>
          </label>
          <label>
            {t("Objetivo")}
            <select name="goal" defaultValue={goalValue}>
              <option value="emagrecimento">{t("Emagrecimento")}</option>
              <option value="bulking">{t("Bulking (ganho de massa)")}</option>
              <option value="definicao">{t("Cutting (definição)")}</option>
              <option value="musculacao">{t("Musculação normal / manutenção")}</option>
              <option value="recomposicao">{t("Recomposição corporal")}</option>
              <option value="manutencao">{t("Manutenção de peso")}</option>
              <option value="condicionamento">{t("Condicionamento")}</option>
            </select>
          </label>
          <Field label="Cidade" name="city" defaultValue={profile.city || ""} />
          <Field
            label="Horário do treino"
            name="training_time"
            type="time"
            defaultValue={profile.training_time || "18:00"}
          />
          <label>
            {t("Dias de treino")}
            <select
              name="training_days"
              multiple
              defaultValue={profile.training_days || ["Seg", "Qua", "Sex"]}
            >
              <option value="Seg">{t("Seg")}</option>
              <option value="Ter">{t("Ter")}</option>
              <option value="Qua">{t("Qua")}</option>
              <option value="Qui">{t("Qui")}</option>
              <option value="Sex">{t("Sex")}</option>
              <option value="Sáb">{t("Sáb")}</option>
              <option value="Dom">{t("Dom")}</option>
            </select>
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              name="reminders_enabled"
              defaultChecked={profile.reminders_enabled}
              onChange={(e) => {
                if (
                  e.target.checked &&
                  typeof Notification !== "undefined" &&
                  Notification.permission === "default"
                )
                  Notification.requestPermission();
              }}
            />
            {t("Ativar lembretes no horário escolhido")}
          </label>
          <fieldset className="reminder-type-options">
            <legend>{t("Quais lembretes deseja receber?")}</legend>
            {[
              ["treino", t("Treino")],
              ["agua", t("Água")],
              ["refeicao", t("Refeições")],
            ].map(([value, label]) => (
              <label className="checkbox" key={value}>
                <input
                  type="checkbox"
                  name="reminder_types"
                  value={value}
                  defaultChecked={(
                    profile.reminder_types || ["treino", "agua"]
                  ).includes(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
          </details>
          <details className="profile-advanced">
            <summary>
              <span><small>{t("DADOS OPCIONAIS")}</small><b>{t("Personalizar nutrição e rotina")}</b></span>
              <span className="profile-advanced-hint">{t("Ajustar")}</span>
            </summary>
            <div className="profile-section-label">
              <span className="eyebrow">{t("DADOS DA PERSONALIZAÇÃO")}</span>
              <b>{t("Nutrição, rotina e disponibilidade")}</b>
            </div>
          <Field
            label="Data de nascimento"
            name="birth_date"
            type="date"
            defaultValue={profile.birth_date || ""}
          />
          <p className="profile-age-note">
            {profile.age
              ? <>{t("Idade calculada automaticamente")}: <b>{profile.age} {t("anos")}</b>.</>
              : t("A idade será calculada automaticamente pela data de nascimento.")}
          </p>
          <Field
            label="Peso inicial (kg)"
            name="initial_weight"
            type="number"
            min="20"
            max="400"
            step="0.1"
            defaultValue={profile.initial_weight || ""}
          />
          <label>
            {t("Atividade diária")}
            <select
              name="daily_activity"
              defaultValue={profile.daily_activity || "moderate"}
            >
              <option value="sedentary">{t("Pouco ativo")}</option>
              <option value="light">{t("Levemente ativo")}</option>
              <option value="moderate">{t("Moderadamente ativo")}</option>
              <option value="active">{t("Muito ativo")}</option>
              <option value="very_active">{t("Extremamente ativo")}</option>
            </select>
          </label>
          <label>
            {t("Intensidade dos treinos")}
            <select
              name="training_intensity"
              defaultValue={profile.training_intensity || "moderate"}
            >
              <option value="easy">Leve</option>
              <option value="moderate">Moderada</option>
              <option value="hard">Alta</option>
            </select>
          </label>
          <Field
            label="Duração do treino (min)"
            name="training_duration"
            type="number"
            min="10"
            max="240"
            defaultValue={profile.training_duration || 45}
          />
          <Field
            label="Frequência de treino (dias/semana)"
            name="training_frequency"
            type="number"
            min="2"
            max="6"
            defaultValue={profile.training_frequency || profile.training_days_count || 3}
          />
          <Field
            label="Pessoas para quem preparar o plano"
            name="household_size"
            type="number"
            min="1"
            max="12"
            defaultValue={profile.household_size || profile.people_count || 1}
          />
          <label>
            {t("Local principal de treino")}
            <select
              name="training_location"
              defaultValue={profile.training_location === "ginasio" ? "ginasio" : "casa"}
            >
              <option value="ginasio">{t("Gym")}</option>
              <option value="casa">{t("Home")}</option>
            </select>
          </label>
          <label>
            {t("Orçamento alimentar")}
            <select
              name="food_budget"
              defaultValue={profile.food_budget || "medium"}
            >
              <option value="low">{t("Económico")}</option>
              <option value="medium">Moderado</option>
              <option value="high">{t("Flexível")}</option>
            </select>
          </label>
          <Field
            label="Alergias ou intolerâncias"
            name="allergies"
            defaultValue={profile.allergies || ""}
          />
          <Field
            label="Alimentos e pratos disponíveis"
            name="available_foods"
            defaultValue={profile.available_foods || ""}
          />
          <Field
            label="Alimentos que não consome"
            name="foods_to_avoid"
            defaultValue={profile.foods_to_avoid || profile.food_dislikes || ""}
          />
                    <label className="profile-wide-field">
            {t("Preferências e pratos locais")}
            <textarea
              name="food_preferences"
              defaultValue={profile.food_preferences || ""}
            />
          </label>
          <label className="profile-wide-field">
            {t("Suplementos informados")}
            <textarea
              name="supplements"
              defaultValue={
                Array.isArray(profile.supplements)
                  ? profile.supplements.join(", ")
                  : profile.supplements || ""
              }
            />
          </label>
          </details>
        </div>
        <button className="primary" disabled={busy}>
          {t("Salvar perfil")}
        </button>
      </form>
      <details className="profile-advanced profile-account-settings">
        <summary>
          <span><small>{t("DEFINIÇÕES DA CONTA")}</small><b>{t("Idioma, aparência e privacidade")}</b></span>
          <span className="profile-advanced-hint">{t("Ajustar")}</span>
        </summary>
      <section className="language-settings">
        <div>
          <span className="eyebrow">PREFERÊNCIAS</span>
          <h2>{translateUiText("Idioma do aplicativo", language)}</h2>
          <p>{t("Altere os textos principais, navegação e instruções do treino guiado.")}</p>
        </div>
        <select
          aria-label={translateUiText("Idioma do aplicativo", language)}
          value={language}
          onChange={async (event) => {
            const value = event.target.value;
            setLanguage(value);
            await mutate("profiles", { language: value }, userId);
          }}
        >
          {languageOptions.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
        </select>
      </section>
      {profile.onboarding_completed && (
      <section className="theme-settings">
        <div>
          <span className="eyebrow">{translateUiText("APARÊNCIA", language)}</span>
          <h2>{t("Tema do aplicativo")}</h2>
          <p>{t("Escolha a paleta que deixa o seu treino mais confortável de acompanhar. A preferência fica guardada neste dispositivo.")}</p>
        </div>
        <div className="theme-options">
          <button
            type="button"
            className={theme === "forest" ? "selected" : ""}
            onClick={() => onThemeChange?.("forest")}
          >
            <span className="theme-preview theme-preview-forest">
              <i />
              <i />
              <i />
            </span>
            <b>{t("Forest Flow")}</b>
            <small>{t("Verde floresta · terracota")}</small>
          </button>
          <button
            type="button"
            className={theme === "dark" ? "selected" : ""}
            onClick={() => onThemeChange?.("dark")}
          >
            <span className="theme-preview theme-preview-dark">
              <i />
              <i />
              <i />
            </span>
            <b>{t("Dark Fitness")}</b>
            <small>{t("Grafite · laranja")}</small>
          </button>
          <button
            type="button"
            className={theme === "sprint" ? "selected" : ""}
            onClick={() => onThemeChange?.("sprint")}
          >
            <span className="theme-preview theme-preview-sprint">
              <i />
              <i />
              <i />
            </span>
            <b>{translateUiText("Sprint Energy", language)}</b>
            <small>{translateUiText("Grafite · lima elétrica", language)}</small>
          </button>
          <button
            type="button"
            className={theme === "blue" ? "selected" : ""}
            onClick={() => onThemeChange?.("blue")}
          >
            <span className="theme-preview theme-preview-blue">
              <i />
              <i />
              <i />
            </span>
            <b>{translateUiText("Ocean Light", language)}</b>
            <small>{translateUiText("Branco · azul · violeta", language)}</small>
          </button>
        </div>
      </section>
      )}
      <form
        className="avatar-upload"
        onSubmit={async (e) => {
          e.preventDefault();
          const file = e.currentTarget.elements.avatar.files?.[0];
          if (!file) return;
          try {
            const path = await upload("profile-photos", file, userId);
            const url = await openMedia("profile-photos", path);
            if (await mutate("profiles", { avatar_url: path }, userId)) {
              setAvatarPreview(url);
              setNotice(t("Foto de perfil atualizada."));
            }
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <label>
          Foto de perfil
          <input
            name="avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="user"
            required
          />
        </label>
        <button className="outline" disabled={busy}>
          {t("Guardar foto de perfil")}
        </button>
      </form>
      {notice && <p className="success">{notice}</p>}
      <div className="guardian">
        🦁 Seus dados são privados. Seu coach atribuído e a administração podem
        acompanhar os registros necessários ao serviço.
      </div>
      <button
        className="outline"
        onClick={() => {
          const exported = Object.fromEntries(
            [
              "profiles",
              "training_logs",
              "progress_measurements",
              "progress_photos",
              "payments",
              "messages",
            ].map((t) => [
              t,
              data[t].filter((r) =>
                t === "profiles" ? r.id === userId : r.user_id === userId,
              ),
            ]),
          );
          const u = URL.createObjectURL(
            new Blob([JSON.stringify(exported, null, 2)], {
              type: "application/json",
            }),
          );
          const a = document.createElement("a");
          a.href = u;
          a.download = "meus-dados-jl.json";
          a.click();
          setTimeout(() => URL.revokeObjectURL(u), 1000);
        }}
      >
        Exportar meus registros
      </button>
      <button
        className="text-btn"
        disabled={busy || isDemo}
        onClick={async () => {
          if (
            await mutate("account_requests", {
              user_id: userId,
              type: "deletion",
              status: "pending",
            })
          )
            setNotice(
              "Solicitação de exclusão enviada à administração. A exclusão será processada pelo responsável.",
            );
        }}
      >
        Solicitar exclusão da conta
      </button>
      <details>
        <summary>Privacidade e responsabilidade</summary>
        <p>
          Os dados permanecem na plataforma até serem excluídos pelo titular ou
          pela administração. O proprietário deve fornecer seu contato e
          política de retenção antes do lançamento comercial. Orientações de
          treino não substituem profissionais de saúde.
        </p>
      </details>
      </details>
    </>
  );
}
const defaultChallenges = [
  {
    id: "move",
    title: "Movimente-se hoje",
    description: "Complete o treino planejado do dia.",
    points: 25,
  },
  {
    id: "water",
    title: "Hidratação em dia",
    description: "Registre sua hidratação e mantenha a rotina.",
    points: 10,
  },
  {
    id: "progress",
    title: "Registre sua evolução",
    description: "Adicione uma medida ou uma foto privada de progresso.",
    points: 15,
  },
  {
    id: "consistency",
    title: "Volte amanhã",
    description: "Mantenha a sequência por mais um dia.",
    points: 20,
  },
  {
    id: "stretch",
    title: "Mobilidade consciente",
    description: "Faça 8 minutos de mobilidade sem dor.",
    points: 10,
  },
];
export function CommunityAvatar({ person }) {
  const raw = String(person?.avatar_url || "");
  const [src, setSrc] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    setSrc("");
    setFailed(false);
    if (!raw) return () => { active = false; };
    if (/^https?:\/\//i.test(raw)) {
      setSrc(raw);
      return () => { active = false; };
    }
    openMedia("profile-photos", raw, 3600)
      .then((url) => { if (active) setSrc(url || ""); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [raw]);
  const fallback = String(person?.full_name || "JL")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
  return (
    <span className="community-avatar">
      {src && !failed ? (
        <img
          src={src}
          alt={"Foto de " + (person?.full_name || "membro")}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : fallback}
    </span>
  );
}

export function Challenges() {
  const { data, userId, mutate, busy, setError, refresh } = useStore();
  const today = new Date().toLocaleDateString("en-CA");
  const authenticated = userId !== "demo";
  const [proofFiles, setProofFiles] = useState({});
  const [uploadingId, setUploadingId] = useState("");
  const [proofUrls, setProofUrls] = useState({});
  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [messageText, setMessageText] = useState("");
  const challenges = (data.daily_challenges?.length ? data.daily_challenges : defaultChallenges)
    .filter((item) => item.active !== false);
  const completions = (data.challenge_completions || []).filter(
    (item) => item.user_id === userId && String(item.completed_on || "").slice(0, 10) === today,
  );
  const completedIds = new Set(completions.map((item) => item.challenge_id));
  const proofRows = (data.challenge_completions || [])
    .filter((item) => item.proof_path)
    .sort((a, b) => new Date(b.created_at || b.completed_on || 0) - new Date(a.created_at || a.completed_on || 0))
    .slice(0, 12);
  const proofKey = proofRows.map((item) => item.id + ":" + item.proof_path).join("|");
  useEffect(() => {
    let active = true;
    if (!proofRows.length) {
      setProofUrls({});
      return () => { active = false; };
    }
    Promise.all(proofRows.map(async (item) => {
      try { return [item.id, await openMedia("challenge-proofs", item.proof_path, 3600)]; }
      catch { return [item.id, null]; }
    })).then((entries) => {
      if (active) setProofUrls(Object.fromEntries(entries.filter(([, url]) => url)));
    });
    return () => { active = false; };
  }, [proofKey]);

  const members = [...new Map(
    [...(data.community_leaderboard || []), ...(data.profiles || [])]
      .filter((person) => person?.id)
      .map((person) => [person.id, person]),
  ).values()].filter((person) => person.id !== userId);
  const leaderboard = [...(data.community_leaderboard || [])]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 10);
  const friendshipRows = data.friendships || [];
  const relationFor = (personId) => friendshipRows.find((row) =>
    (row.requester_id === userId && row.addressee_id === personId)
    || (row.requester_id === personId && row.addressee_id === userId),
  );
  const incomingRequests = friendshipRows
    .filter((row) => row.status === "pending" && row.addressee_id === userId)
    .map((row) => ({
      row,
      person: members.find((person) => person.id === row.requester_id) || { id: row.requester_id, full_name: "Membro JL" },
    }));
  const friendIds = friendshipRows
    .filter((row) => row.status === "accepted" && (row.requester_id === userId || row.addressee_id === userId))
    .map((row) => row.requester_id === userId ? row.addressee_id : row.requester_id);
  const friends = friendIds.map((id) => members.find((person) => person.id === id) || { id, full_name: "Membro JL" });
  const friendsKey = friends.map((person) => person.id).join("|");
  useEffect(() => {
    if (!friends.some((person) => person.id === selectedFriendId)) {
      setSelectedFriendId(friends[0]?.id || "");
    }
  }, [friendsKey, selectedFriendId]);
  const selectedFriend = friends.find((person) => person.id === selectedFriendId) || null;
  const chatMessages = (data.community_messages || [])
    .filter((item) =>
      (item.sender_id === userId && item.recipient_id === selectedFriendId)
      || (item.sender_id === selectedFriendId && item.recipient_id === userId),
    )
    .sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  const myPoints = completions.reduce((sum, item) => sum + Number(item.points || 0), 0);

  const complete = async (challenge) => {
    if (completedIds.has(challenge.id) || busy || uploadingId) return;
    if (!authenticated) {
      setError("Entre na sua conta para enviar o vídeo e participar da comunidade.");
      return;
    }
    const file = proofFiles[challenge.id];
    if (!file || !String(file.type || "").startsWith("video/")) {
      setError("Grave ou escolha um vídeo para comprovar este desafio.");
      return;
    }
    setUploadingId(challenge.id);
    setError("");
    let path = "";
    try {
      path = await upload("challenge-proofs", file, userId);
      const ok = await mutate("challenge_completions", {
        id: crypto.randomUUID(),
        user_id: userId,
        challenge_id: challenge.id,
        completed_on: today,
        points: challenge.points,
        proof_path: path,
        proof_mime_type: file.type,
        caption: challenge.title,
      });
      if (ok) {
        setProofFiles((current) => {
          const next = { ...current };
          delete next[challenge.id];
          return next;
        });
        await refresh?.();
      } else if (path) {
        await supabase.storage.from("challenge-proofs").remove([path]);
      }
    } catch (error) {
      setError(error.message || "Não foi possível enviar o vídeo. Tente novamente.");
      if (path) await supabase.storage.from("challenge-proofs").remove([path]).catch(() => {});
    } finally {
      setUploadingId("");
    }
  };

  const sendFriendRequest = async (person) => {
    const relation = relationFor(person.id);
    if (!authenticated) {
      setError("Entre na sua conta para adicionar amigos.");
      return;
    }
    if (relation?.status === "pending" && relation.addressee_id === userId) {
      await mutate("friendships", { status: "accepted" }, relation.id);
      return;
    }
    if (!relation) {
      await mutate("friendships", {
        id: crypto.randomUUID(),
        requester_id: userId,
        addressee_id: person.id,
        status: "pending",
      });
    }
  };
  const respondToRequest = async (row, status) => {
    await mutate("friendships", { status }, row.id);
  };
  const sendMessage = async (event) => {
    event.preventDefault();
    const body = messageText.trim();
    if (!body || !selectedFriendId || !authenticated || busy) return;
    const ok = await mutate("community_messages", {
      id: crypto.randomUUID(),
      sender_id: userId,
      recipient_id: selectedFriendId,
      body,
    });
    if (ok) setMessageText("");
  };

  return (
    <>
      <Title tag="CONSISTÊNCIA EM COMUNIDADE" title="Desafios de hoje" />
      <section className="challenge-hero">
        <div>
          <span className="eyebrow">PEQUENAS AÇÕES, RESULTADOS REAIS</span>
          <h2>Seu placar de hoje</h2>
          <p>Envie uma prova em vídeo, some pontos, acompanhe o ranking e partilhe a sua evolução com a comunidade.</p>
        </div>
        <div className="challenge-score">
          <strong>{myPoints}</strong>
          <span>pontos hoje</span>
        </div>
      </section>

      <div className="challenge-layout">
        <section>
          <div className="daily-challenges">
            {challenges.map((challenge) => {
              const done = completedIds.has(challenge.id);
              const file = proofFiles[challenge.id];
              return (
                <article className={"challenge-card " + (done ? "done" : "")} key={challenge.id}>
                  <div className="challenge-icon">
                    {challenge.id === "move" ? "⚡" : challenge.id === "water" ? "💧" : challenge.id === "progress" ? "📸" : challenge.id === "consistency" ? "🔥" : "🧘"}
                  </div>
                  <div className="challenge-card-copy">
                    <h3>{challenge.title}</h3>
                    <p>{challenge.description}</p>
                    <b>+{challenge.points} pontos</b>
                    {done ? (
                      <small className="challenge-proof-status">Vídeo enviado à comunidade</small>
                    ) : (
                      <label className="challenge-video-picker">
                        <span>{file ? file.name : "Gravar ou escolher vídeo"}</span>
                        <small>MP4, WebM ou MOV · máximo 100 MB</small>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          capture="user"
                          disabled={!authenticated || busy || Boolean(uploadingId)}
                          onChange={(event) => {
                            const selected = event.target.files?.[0];
                            if (selected) setProofFiles((current) => ({ ...current, [challenge.id]: selected }));
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <button
                    type="button"
                    className={done ? "outline" : "primary"}
                    disabled={busy || Boolean(uploadingId) || done || !file || !authenticated}
                    onClick={() => complete(challenge)}
                  >
                    {done ? "Concluído ✓" : uploadingId === challenge.id ? "Enviando vídeo…" : "Concluir com vídeo"}
                  </button>
                </article>
              );
            })}
          </div>
          {!authenticated && <p className="community-login-note">Entre na sua conta para gravar vídeos, concluir desafios e conversar com outros membros.</p>}
        </section>

        <aside className="leaderboard-card">
          <div className="section-head">
            <div><span className="eyebrow">COMUNIDADE JL</span><h2>Ranking</h2></div>
            <span className="pill">TOP 10</span>
          </div>
          <p className="leaderboard-note">Pontos por treinos registados e desafios concluídos com vídeo.</p>
          <div className="leaderboard-list">
            {leaderboard.map((person, index) => (
              <div className={"leaderboard-row" + (index < 3 ? " top-rank top-rank-" + (index + 1) : "")} key={person.id}>
                <span className="leaderboard-rank">{index < 3 ? ["🥇", "🥈", "🥉"][index] : index + 1}</span>
                <CommunityAvatar person={person} />
                <div><b>{person.full_name || "Membro JL"}</b><small>{person.workouts || 0} treinos · {person.challenges || 0} desafios</small></div>
                <span>{person.points || 0}</span>
              </div>
            ))}
          </div>
          {!leaderboard.length && <Empty>O ranking aparecerá aqui quando os membros registarem treinos ou desafios.</Empty>}
        </aside>
      </div>

      <section className="community-feed-card">
        <div className="section-head"><div><span className="eyebrow">PROVAS COMPARTILHADAS</span><h2>Comunidade em movimento</h2></div><span className="pill">{proofRows.length} vídeos</span></div>
        <div className="community-feed-grid">
          {proofRows.map((post) => {
            const person = (data.community_leaderboard || []).find((item) => item.id === post.user_id) || { id: post.user_id, full_name: "Membro JL" };
            const challenge = challenges.find((item) => item.id === post.challenge_id);
            return (
              <article className="community-proof-card" key={post.id}>
                <div className="community-proof-author"><CommunityAvatar person={person} /><div><b>{person.full_name}</b><small>{new Date(post.created_at || post.completed_on).toLocaleDateString("pt-MZ")}</small></div><strong>+{post.points || 0}</strong></div>
                {proofUrls[post.id] ? <video src={proofUrls[post.id]} controls playsInline preload="metadata" /> : <div className="community-video-placeholder">A carregar vídeo…</div>}
                <p>{post.caption || challenge?.title || "Desafio concluído"}</p>
              </article>
            );
          })}
        </div>
        {!proofRows.length && <Empty>Os vídeos enviados pelos membros aparecerão aqui depois da primeira conclusão.</Empty>}
      </section>

      <section className="community-social-grid">
        <article className="community-social-card">
          <div className="section-head"><div><span className="eyebrow">LIGAÇÕES</span><h2>Amigos</h2></div><span className="pill">{friends.length}</span></div>
          {incomingRequests.length > 0 && <div className="community-requests">
            <b>Pedidos recebidos</b>
            {incomingRequests.map(({ row, person }) => <div className="community-request-row" key={row.id}><CommunityAvatar person={person} /><span>{person.full_name}</span><button type="button" className="primary small" disabled={busy} onClick={() => respondToRequest(row, "accepted")}>Aceitar</button><button type="button" className="text-btn" disabled={busy} onClick={() => respondToRequest(row, "rejected")}>Recusar</button></div>)}
          </div>}
          <div className="community-people-list">
            {members.slice(0, 12).map((person) => {
              const relation = relationFor(person.id);
              const isFriend = relation?.status === "accepted";
              const pendingOut = relation?.status === "pending" && relation.requester_id === userId;
              const pendingIn = relation?.status === "pending" && relation.addressee_id === userId;
              return <div className="community-person-row" key={person.id}>
                <CommunityAvatar person={person} />
                <div><b>{person.full_name || "Membro JL"}</b><small>{person.points || 0} pontos</small></div>
                <button type="button" className={isFriend ? "outline small" : "primary small"} disabled={!authenticated || busy || isFriend || pendingOut || relation?.status === "rejected"} onClick={() => sendFriendRequest(person)}>
                  {isFriend ? "Amigo" : pendingOut ? "Enviado" : pendingIn ? "Aceitar" : relation?.status === "rejected" ? "Recusado" : "Adicionar"}
                </button>
              </div>;
            })}
          </div>
          {!members.length && <Empty>Os membros da comunidade aparecerão aqui.</Empty>}
        </article>

        <article className="community-social-card community-chat-card">
          <div className="section-head"><div><span className="eyebrow">MENSAGENS PRIVADAS</span><h2>Chat com amigos</h2></div></div>
          {friends.length ? (
            <>
              <div className="community-friend-tabs">
                {friends.map((person) => <button type="button" key={person.id} className={selectedFriendId === person.id ? "active" : ""} onClick={() => setSelectedFriendId(person.id)}><CommunityAvatar person={person} /><span>{person.full_name || "Membro"}</span></button>)}
              </div>
              <div className="community-chat-messages" aria-live="polite">
                {chatMessages.map((message) => <div key={message.id} className={"community-chat-message " + (message.sender_id === userId ? "mine" : "theirs")}><p>{message.body}</p><small>{new Date(message.created_at).toLocaleString("pt-MZ")}</small></div>)}
                {!chatMessages.length && <Empty>Comece a conversa com {selectedFriend?.full_name || "o seu amigo"}.</Empty>}
              </div>
              <form className="community-chat-compose" onSubmit={sendMessage}>
                <textarea rows={2} maxLength={1000} value={messageText} onChange={(event) => setMessageText(event.target.value)} placeholder="Escreva uma mensagem…" />
                <button type="submit" className="primary" disabled={!messageText.trim() || busy}>Enviar</button>
              </form>
            </>
          ) : <Empty>Adicione um membro e aguarde a aceitação para começar uma conversa privada.</Empty>}
        </article>
      </section>

      <p className="challenge-disclaimer">Os pontos são motivacionais e não substituem orientação de treino. Grave apenas a sua própria execução, num espaço seguro, e não publique vídeos de outras pessoas sem consentimento.</p>
    </>
  );
}

export function Plans({ plan, whatsapp, settings }) {
  const { data, userId, mutate, busy, setError } = useStore();
  const [selected, setSelected] = useState("");
  const [notice, setNotice] = useState("");
  async function submit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = data.plans.find((x) => x.id === selected);
    try {
      let proofPath = null;
      const file = f.get("proof");
      if (file?.size) proofPath = await upload("payment-proofs", file, userId);
      const ok = await mutate("payments", {
        user_id: userId,
        plan_id: p.id,
        amount: p.price,
        method: f.get("method"),
        reference: f.get("reference"),
        proof_path: proofPath,
        status: "pending",
      });
      if (ok) {
        setNotice(
          "Pedido registrado. A administração vai conferir o comprovativo antes de liberar o plano.",
        );
        setSelected("");
      }
    } catch (err) {
      setError(err.message);
    }
  }
  const tiers = [...data.plans].sort((a, b) => a.tier - b.tier);
  return (
    <>
      <Title tag="INVISTA EM CONSISTÊNCIA" title="Seu próximo nível" />
      <div className="plan-grid">
        {tiers.map((p) => (
          <div
            key={p.id}
            className={`plan-card ${p.tier === 2 ? "featured" : ""}`}
          >
            <span className="pill">{p.name}</span>
            <h2>
              {p.price.toLocaleString()} <small>MZN / mês</small>
            </h2>
            <p className="muted">{p.description}</p>
            {p.features.map((f) => (
              <p key={f}>✓ {f}</p>
            ))}
            <button
              className="primary"
              disabled={plan.id === p.id}
              onClick={() => setSelected(p.id)}
            >
              {plan.id === p.id
                ? "Seu plano"
                : p.tier
                  ? "Escolher plano"
                  : "Começar grátis"}
            </button>
          </div>
        ))}
      </div>
      <div className="comparison">
        <h2>Compare antes de escolher</h2>
        <div className="comparison-head">
          <span>Benefício</span>
          {tiers.map((p) => (
            <b key={p.id}>{p.name}</b>
          ))}
        </div>
        {planMatrix.map(([label, min]) => (
          <div className="comparison-row" key={label}>
            <span>{label}</span>
            {tiers.map((p) => (
              <b
                key={p.id}
                className={
                  p.tier >= ["free", "start", "pro", "premium"].indexOf(min)
                    ? "yes"
                    : "no"
                }
              >
                {p.tier >= ["free", "start", "pro", "premium"].indexOf(min)
                  ? "✓"
                  : "×"}
              </b>
            ))}
          </div>
        ))}
      </div>
      {selected && (
        <form className="panel-form" onSubmit={submit}>
          <h2>Pagamento manual</h2>
          <p>
            Escolha o seu plano e envie o comprovativo.{" "}
            <b>M-Pesa: {settings?.mpesa_number || "848757246"}</b> ·{" "}
            <b>e-Mola: {settings?.emola_number || "868787572"}</b> ·{" "}
            <b>WhatsApp: {settings?.whatsapp || "868787572"}</b>
          </p>
          <a
            className="outline"
            href={whatsapp(
              `Olá! Quero adquirir o plano ${data.plans.find((x) => x.id === selected)?.name} por ${data.plans.find((x) => x.id === selected)?.price} MZN. Envie as instruções de pagamento.`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            Abrir WhatsApp
          </a>
          <label>
            Método
            <select name="method">
              <option>M-Pesa</option>
              <option>e-Mola</option>
              <option>Transferência bancária</option>
            </select>
          </label>
          <Field
            label="Referência do pagamento"
            name="reference"
            required
            maxLength="120"
          />
          <label>
            Foto do comprovativo
            <input
              name="proof"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
            />
          </label>
          <button className="primary" disabled={busy}>
            Enviar para confirmação
          </button>
        </form>
      )}
      {notice && <div className="success">{notice}</div>}
      <h2 className="section-head">Meus pedidos</h2>
      {data.payments
        .filter((p) => p.user_id === userId)
        .map((p) => (
          <div className="event" key={p.id}>
            <b>
              {p.amount} MZN · {p.method}
            </b>
            <span>{p.status}</span>
          </div>
        ))}
    </>
  );
}
export function Contents({ go, plan }) {
  const { data, setError } = useStore(),
    [url, setUrl] = useState(""),
    [type, setType] = useState("");
  const visible = data.content.filter(
    (c) =>
      (data.plans.find((p) => p.id === c.min_plan)?.tier || 0) <=
      (plan?.tier || 0),
  );
  function embed(src) {
    const m = String(src || "").match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
    );
    return m ? `https://www.youtube.com/embed/${m[1]}?rel=0` : src;
  }
  return (
    <>
      <Title tag="APRENDA A CADA TREINO" title="Conteúdos" />
      {plan.tier < 2 && (
        <Locked go={go}>
          Videoaulas e conteúdos avançados ficam disponíveis a partir do PRO.
        </Locked>
      )}
      {plan.tier === 2 && (
        <div className="notice-card">
          O plano alimentar e acompanhamento completo ficam no PREMIUM. Vídeos e
          conteúdos do PRO já estão desbloqueados.
        </div>
      )}
      <div className="video-grid">
        {visible.map((c) => (
          <div className="video-card" key={c.id}>
            <div className="video-thumb">
              <span>{c.type === "video" ? "▶" : "▤"}</span>
            </div>
            <div className="video-body">
              <small>{c.type}</small>
              <h3>{c.title}</h3>
              <p>{c.description}</p>
              <button
                className="text-btn"
                disabled={!c.path}
                onClick={async () => {
                  try {
                    setUrl(
                      /^https?:\/\//.test(c.path || "")
                        ? c.path
                        : await openMedia(c.bucket, c.path),
                    );
                    setType(c.type);
                  } catch (e) {
                    setError(e.message);
                  }
                }}
              >
                {c.path ? "Abrir no player" : "Arquivo ainda não enviado"} →
              </button>
            </div>
          </div>
        ))}
      </div>
      {!visible.length && (
        <Empty>
          O coach ainda não publicou conteúdos para seu plano. A área de gestão
          aceita vídeos enviados ou links YouTube.
        </Empty>
      )}
      {url && (
        <div className="media-view">
          <button className="outline" onClick={() => setUrl("")}>
            Fechar
          </button>
          {type === "video" ? (
            embed(url) ? (
              <iframe
                className="video-player"
                src={embed(url)}
                title="Vídeo do JL Trainer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={url} controls autoPlay />
            )
          ) : type === "image" ? (
            <img src={url} alt="Conteúdo do coach" />
          ) : (
            <a href={url} target="_blank" rel="noreferrer">
              Abrir documento privado
            </a>
          )}
        </div>
      )}

    </>
  );
}
export function Schedule({ plan, go }) {
  const { data, userId, rpc, busy } = useStore();
  const events = [...data.calendar_events].sort((a, b) =>
    a.starts_at.localeCompare(b.starts_at),
  );
  const maxBookings = plan.tier === 3 ? 2 : plan.tier === 2 ? 1 : 0;
  const used = data.mentorship_bookings.filter(
    (b) =>
      b.user_id === userId &&
      data.calendar_events.find((e) => e.id === b.event_id)?.kind ===
        "mentorship",
  ).length;
  return (
    <>
      <Title tag="ORGANIZE SUA ROTINA" title="Agenda e mentorias" />
      {plan.tier < 2 && (
        <Locked go={go}>
          Mentorias online com horário marcado começam no PRO. O PREMIUM inclui
          duas reservas.
        </Locked>
      )}
      {plan.tier >= 2 && (
        <div className="notice-card">
          Seu plano permite {maxBookings} mentoria{maxBookings > 1 ? "s" : ""}{" "}
          online com horário marcado. Reservas usadas: {used}/{maxBookings}.
        </div>
      )}
      {events.length ? (
        events.map((e) => {
          const booked = data.mentorship_bookings.some(
            (b) => b.event_id === e.id && b.user_id === userId,
          );
          const canBook =
            e.kind !== "mentorship" || (plan.tier >= 2 && used < maxBookings);
          return (
            <div className="event" key={e.id}>
              <div>
                <b>{e.title}</b>
                <small>
                  {new Date(e.starts_at).toLocaleString()} ·{" "}
                  {e.duration_minutes} min
                </small>
                <p>{e.description}</p>
                {e.meeting_url && (
                  <a href={e.meeting_url} target="_blank" rel="noreferrer">
                    Abrir reunião online
                  </a>
                )}
              </div>
              {e.kind === "mentorship" && (
                <button
                  className="outline"
                  disabled={
                    busy ||
                    !canBook ||
                    booked ||
                    new Date(e.starts_at) < new Date()
                  }
                  onClick={() => rpc("book_mentorship", { event: e.id })}
                >
                  {booked
                    ? "Reservado ✓"
                    : canBook
                      ? "Reservar mentoria"
                      : "Limite do plano atingido"}
                </button>
              )}
            </div>
          );
        })
      ) : (
        <Empty>
          Sem horários publicados. O coach pode cadastrar os horários online na
          gestão.
        </Empty>
      )}
    </>
  );
}
export function Assistant({ plan, go }) {
  const { data, userId, rpc, busy, isDemo } = useStore(),
    [text, setText] = useState(""),
    [preview, setPreview] = useState([]);
  if (plan.tier < 1)
    return (
      <>
        <Title tag="SEU PARCEIRO DE ROTINA" title="Assistente JL" />
        <Locked go={go}>
          O chat está disponível a partir do START. O plano gratuito permite
          explorar exercícios e registrar peso.
        </Locked>
      </>
    );
  const messages = isDemo
    ? preview
    : data.messages
        .filter((m) => m.user_id === userId)
        .sort((a, b) => a.created_at.localeCompare(b.created_at));
  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    if (isDemo)
      setPreview((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "user", body: text },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          body: "Prévia do assistente guiado. O chat conectado usa seus registros autorizados.",
        },
      ]);
    else await rpc("guided_chat", { question: text });
    setText("");
  }
  return (
    <>
      <Title tag="LEO • ASSISTENTE GUIADO" title="Vamos conversar" />
      <div className="chat-shell">
        <div className="chat-head">
          <div className="chat-avatar">🦁</div>
          <div>
            <b>Leo, seu parceiro JL</b>
            <small>Respostas guiadas • sem IA generativa conectada</small>
          </div>
        </div>
        <div className="chat-messages">
          <div className="chat-row bot">
            <div className="chat-bubble">
              Olá! Posso consultar seu treino e sua consistência ou compartilhar
              lembretes gerais. Digite “treino” ou “progresso”.
            </div>
          </div>
          {messages.map((m) => (
            <div
              className={`chat-row ${m.role === "user" ? "user" : "bot"}`}
              key={m.id}
            >
              <div className="chat-bubble">{m.body}</div>
            </div>
          ))}
        </div>
        <form className="chat-input" onSubmit={send}>
          <input
            aria-label="Mensagem"
            value={text}
            maxLength="1000"
            required
            onChange={(e) => setText(e.target.value)}
            placeholder="Qual é meu treino?"
          />
          <button disabled={busy} aria-label="Enviar mensagem">
            ➤
          </button>
        </form>
        <p className="chat-note">
          Não oferece diagnóstico, dieta clínica ou prescrição. Converse com seu
          coach.
        </p>
      </div>
    </>
  );
}

// Só exibimos uma fotografia quando ela pertence de facto ao alimento indicado.
// Uma foto genérica/repetida é pior do que mostrar o nome do ingrediente com clareza.
// Fotografias verificadas por identificador: não reutilizar uma imagem de outro alimento.
const foodPhoto = (food) => { const known = foodLibrary.find((item) => item.name === (food?.sourceName || food?.name)); return known?.image_path || known?.image || food?.image_path || food?.image || null; };

export function Nutrition({ plan, whatsapp }) {
  const { profile, userId, data, refresh, setError, loading, mutate } = useStore();
  const [language] = useLanguage();
  const t = (value) => translateUiText(value, language);
  const dateLocale = ({ pt: "pt-MZ", en: "en-US", fr: "fr-FR", es: "es-ES", zh: "zh-CN", hi: "hi-IN" })[language] || "pt-MZ";
  const nutritionLogs = (data.daily_nutrition_logs || []).filter((log) => log.user_id === userId);
  const nutritionTracking = accountDayStatuses(profile.created_at, [], nutritionLogs, new Date(), profile);
  const consumedStorageKey = `jl-meals-consumed-${profile.id || "guest"}`;
  const hydrationStorageKey = `jl-hydration-${profile.id || "guest"}-${new Date().toLocaleDateString("en-CA")}`;
  const [day, setDay] = useState(() => Math.max(1, Math.min(30, Number(profile.nutrition_day) || accountDayNumber(profile.created_at)))),
    [shoppingDays, setShoppingDays] = useState(30),
    [shoppingOpen, setShoppingOpen] = useState(false),
    [nutritionView, setNutritionView] = useState("plan"),
    [foodSearch, setFoodSearch] = useState(""),
    [foodGroup, setFoodGroup] = useState("Todos"),
    [consumed, setConsumed] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem(consumedStorageKey) || "[]");
      } catch {
        return [];
      }
    }),
    [replaced, setReplaced] = useState({});
  useEffect(() => {
    if (profile.created_at && !profile.nutrition_day && day === 1) {
      setDay(Math.min(30, accountDayNumber(profile.created_at)));
    }
  }, [profile.created_at]);
  const intensity = ageFromProfile(profile) < 18 ? "moderate" : profile.training_intensity || "moderate";
  const shoppingStorageKey = "jl-shopping-" + (userId || profile.id || "guest");
  const [shoppingState, setShoppingState] = useState({ key: null, items: {} });
  const shoppingChecked = shoppingState.key === shoppingStorageKey ? shoppingState.items : {};
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(shoppingStorageKey) || "{}");
      setShoppingState({ key: shoppingStorageKey, items: saved });
    } catch {
      setShoppingState({ key: shoppingStorageKey, items: {} });
    }
  }, [shoppingStorageKey]);
  useEffect(() => {
    if (shoppingState.key !== shoppingStorageKey) return;
    try {
      localStorage.setItem(shoppingStorageKey, JSON.stringify(shoppingState.items));
    } catch {}
  }, [shoppingState, shoppingStorageKey]);
  const [waterMl, setWaterMl] = useState(() => {
    try {
      return Math.max(
        0,
        Number(localStorage.getItem(hydrationStorageKey)) || 0,
      );
    } catch {
      return 0;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(consumedStorageKey, JSON.stringify(consumed));
    } catch {}
  }, [consumed, consumedStorageKey]);
  useEffect(() => {
    try {
      localStorage.setItem(hydrationStorageKey, String(waterMl));
    } catch {}
  }, [waterMl, hydrationStorageKey]);
  const n = nutritionPlan({
      ...profile,
      language,
      training_intensity: intensity,
      nutrition_day: Number(day),
    }),
    shoppingList = buildShoppingList({ ...profile, language, training_intensity: intensity }, shoppingDays, n.portionScale),
    allowed = (plan?.tier || 0) >= 3;
  const selectedPlanDate = accountDateForDay(profile.created_at, day);
  const selectedNutritionLog = nutritionLogs.find((log) => String(log.local_date || "").slice(0, 10) === selectedPlanDate);
  const selectedMealKeys = Array.isArray(selectedNutritionLog?.meal_keys) ? selectedNutritionLog.meal_keys : [];
  const mealStorageKey = (meal, planDay = day) => String(planDay) + "-" + (meal.mealKey || meal.title);
  const mealStorageAliases = (meal, planDay = day) => Array.from(new Set([
    mealStorageKey(meal, planDay),
    String(planDay) + "-" + meal.title,
    ...["pt", "en", "fr", "es", "zh", "hi"].map((code) => String(planDay) + "-" + translateMealLabel(meal.mealKey || meal.title, code)),
  ]));
  const isMealConsumed = (meal, planDay = day, keys = consumed) =>
    mealStorageAliases(meal, planDay).some((key) => keys.includes(key));
  useEffect(() => {
    const prefix = String(day) + "-";
    setConsumed((current) => {
      const dayKeys = [...current.filter((key) => key.startsWith(prefix)), ...selectedMealKeys];
      const normalized = n.meals
        .filter((meal) => isMealConsumed(meal, day, dayKeys))
        .map((meal) => mealStorageKey(meal, day));
      return [...current.filter((key) => !key.startsWith(prefix)), ...normalized];
    });
  }, [selectedPlanDate, selectedNutritionLog?.updated_at, selectedMealKeys.join("|"), day, language, n.meals.length]);
  useEffect(() => {
    const prefix = String(day) + "-";
    setConsumed((current) => {
      const dayKeys = current.filter((key) => key.startsWith(prefix));
      const normalized = n.meals
        .filter((meal) => isMealConsumed(meal, day, dayKeys))
        .map((meal) => mealStorageKey(meal, day));
      return [...current.filter((key) => !key.startsWith(prefix)), ...normalized];
    });
  }, [day, language, n.meals.length]);
  const persistNutritionDay = async (nextConsumed) => {
    if (!supabase || !userId || userId === "demo" || !selectedPlanDate || !n.meals.length) return;
    const mealKeys = n.meals
      .filter((meal) => isMealConsumed(meal, day, nextConsumed))
      .map((meal) => mealStorageKey(meal, day));
    try {
      const { error } = await supabase.from("daily_nutrition_logs").upsert({
        user_id: userId,
        local_date: selectedPlanDate,
        plan_day: Number(day),
        meal_keys: mealKeys,
        expected_meals: n.meals.length,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id,local_date" });
      if (error) throw error;
      await refresh?.();
    } catch (error) {
      setError(error.message);
    }
  };
  const legacyConsumedKey = consumed.join("|");
  useEffect(() => {
    if (loading || !supabase || !userId || userId === "demo" || !selectedPlanDate || selectedNutritionLog || !n.meals.length) return;
    const selectedKeys = n.meals
      .filter((meal) => isMealConsumed(meal, day, consumed))
      .map((meal) => mealStorageKey(meal, day));
    if (selectedKeys.length) void persistNutritionDay(consumed);
  }, [loading, selectedPlanDate, selectedNutritionLog?.id, n.meals.length]);
  useEffect(() => {
    if (loading || !supabase || !userId || userId === "demo" || !profile.created_at || !legacyConsumedKey) return;
    const existingDates = new Set(nutritionLogs.map((log) => String(log.local_date || "").slice(0, 10)));
    const payloads = [];
    for (let planDay = 1; planDay <= 30; planDay += 1) {
      if (planDay === Number(day)) continue;
      const localDate = accountDateForDay(profile.created_at, planDay);
      if (!localDate || existingDates.has(localDate)) continue;
      const dayPlan = nutritionPlan({
        ...profile,
        language,
        training_intensity: intensity,
        nutrition_day: planDay,
      });
      const meals = dayPlan.meals || [];
      if (!meals.length) continue;
      const mealKeys = meals
        .filter((meal) => isMealConsumed(meal, planDay, consumed))
        .map((meal) => mealStorageKey(meal, planDay));
      if (!mealKeys.length) continue;
      payloads.push({
        user_id: userId,
        local_date: localDate,
        plan_day: planDay,
        meal_keys: mealKeys,
        expected_meals: meals.length,
        updated_at: new Date().toISOString(),
      });
    }
    if (!payloads.length) return;
    let cancelled = false;
    supabase.from("daily_nutrition_logs").upsert(payloads, { onConflict: "user_id,local_date" })
      .then(({ error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        else refresh?.();
      });
    return () => { cancelled = true; };
  }, [loading, profile.created_at, profile.birth_date, profile.age, profile.goal, profile.modality, profile.current_weight, profile.height, profile.allergies, profile.foods_to_avoid, profile.available_foods, profile.food_budget, profile.training_intensity, userId, nutritionLogs.length, legacyConsumedKey]);
  const foodGroups = ["Todos", ...new Set(foodLibrary.map((food) => food.group))];
  const visibleFoodLibrary = foodLibrary.filter((food) => {
    const displayName = translateFoodName(food.name, language);
    const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase()) || displayName.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesGroup = foodGroup === "Todos" || food.group === foodGroup;
    return matchesSearch && matchesGroup;
  }).map((food) => ({
    ...food,
    displayName: translateFoodName(food.name, language),
    displayPortion: translateIngredientString(food.portion, language),
  }));
  const completedMeals = n.meals.filter((meal) => isMealConsumed(meal, day, consumed)).length;
  const markConsumed = (key) =>
    setConsumed((list) => {
      const next = list.includes(key) ? list.filter((item) => item !== key) : [...list, key];
      void persistNutritionDay(next);
      return next;
    });
  const replaceMeal = (meal) => {
    const alternatives = meal.foods
      .flatMap((food) => foodSubstitutions(food.sourceName || food.name, profile))
      .map((name) => foodLibrary.find((food) => food.name === name))
      .filter(Boolean);
    if (alternatives.length)
      setReplaced((current) => ({
        ...current,
        [meal.title]: alternatives.slice(0, 3),
      }));
  };
  const mealData = (meal) => {
    const hasReplacement = Boolean(replaced[meal.title]?.length);
    const foods = hasReplacement ? replaced[meal.title] : meal.foods;
    const displayFoods = foods.map((food) => ({
      ...food,
      displayName: translateFoodName(food.sourceName || food.name, language),
      displayPortion: translateIngredientString(food.portion, language),
    }));
    const sum = (key) => Math.round(foods.reduce((total, food) => total + (food[key] || 0), 0));
    const totals = hasReplacement ? null : meal.nutrition;
    return {
      ...meal,
      foods: displayFoods,
      items: meal.recipeName ? [meal.recipeName] : displayFoods.map((food) => food.displayName),
      ingredients: hasReplacement
        ? displayFoods.map((food) => food.displayName + " (" + food.displayPortion + ")")
        : meal.ingredients?.length ? meal.ingredients : displayFoods.map((food) => food.displayName + " (" + food.displayPortion + ")"),
      image: meal.image || null,
      kcal: totals?.kcal ?? sum("kcal"),
      protein: totals?.protein ?? sum("protein"),
      carbs: totals?.carbs ?? sum("carbs"),
      fat: totals?.fat ?? sum("fat"),
      fiber: totals?.fiber ?? sum("fiber"),
      allergyWarning: meal.allergyWarning && !hasReplacement,
    };
  };
  return (
    <>
      <Title
        tag={`PLANO ALIMENTAR • ${n.modalityLabel || "PERSONALIZADO"}`}
        title="Comer bem para treinar melhor"
      />
      <div className="nutrition-hero">
        <div>
          <span className="eyebrow">
            PLANO DE 30 DIAS • {n.ageCategory || "PERFIL INDIVIDUAL"}
          </span>
          <h2>{n.modalityLabel || "Plano personalizado"}</h2>
          <p>
            {n.message ||
              n.modalityNote ||
              "Energia, hidratação e rotina ajustadas aos seus dados."}{" "}
            Não substitui nutricionista.
          </p>
          {n.ageNote && (
            <div className="nutrition-safety-note">{n.ageNote}</div>
          )}
        </div>
        <div className="nutrition-kcal">
          <strong>{n.calories ?? "—"}</strong>
          <span>
            {n.ageCategory === "adolescente" ? "sem meta calórica automática para menores" : n.incomplete ? "complete o perfil" : "kcal estimadas/dia"}
          </span>
        </div>
      </div>
      <nav className="nutrition-tabs" aria-label="Secções da alimentação">
        <button type="button" className={nutritionView === "plan" ? "active" : ""} onClick={() => setNutritionView("plan")}>
          <span>01</span> Plano de 30 dias
        </button>
        <button type="button" className={nutritionView === "foods" ? "active" : ""} onClick={() => setNutritionView("foods")}>
          <span>02</span> Alimentos
        </button>
        <button type="button" className="nutrition-shopping-tab" onClick={() => setShoppingOpen(true)}>
          <span>03</span> Lista de compras
        </button>
      </nav>
      {nutritionView === "foods" ? (
        <section className="food-library-section">
          <div className="food-library-heading">
            <div>
              <span className="eyebrow">BIBLIOTECA VISUAL</span>
              <h2>Conheça os alimentos</h2>
              <p>Fotografias associadas ao alimento correto, com porções e valores estimados.</p>
            </div>
            <strong>{visibleFoodLibrary.length} <small>itens</small></strong>
          </div>
          <label className="food-library-search">
            <span>Pesquisar alimento</span>
            <input type="search" value={foodSearch} onChange={(event) => setFoodSearch(event.target.value)} placeholder="Ex.: banana, frango, batata-doce..." />
          </label>
          <div className="food-library-filters">
            {foodGroups.map((group) => (
              <button type="button" key={group} className={foodGroup === group ? "active" : ""} onClick={() => setFoodGroup(group)}>{group}</button>
            ))}
          </div>
          <div className="food-library-grid">
            {visibleFoodLibrary.map((food) => (
              <article className="food-library-card" key={food.id}>
                <div className="food-library-image" style={foodPhoto(food) ? { "--food-image": `url("${foodPhoto(food)}")` } : undefined}>
                  {foodPhoto(food) ? (
                    <><img src={foodPhoto(food)} alt={`Fotografia de ${food.name}`} loading="lazy" style={{ "--food-image": `url("${foodPhoto(food)}")` }} onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false; }} /><span className="food-photo-placeholder" hidden>Fotografia indisponível</span></>
                  ) : <span className="food-photo-placeholder">Fotografia indisponível</span>}
                </div>
                <div className="food-library-copy">
                  <span className="food-library-group">{food.group}</span>
                  <b>{food.name}</b>
                  <small>{food.portion}</small>
                  <div className="food-library-kcal">{food.kcal} kcal <span>por porção</span></div>
                  <div className="food-library-macros">
                    <span><b>{food.protein}g</b> proteína</span>
                    <span><b>{food.carbs}g</b> carboidratos</span>
                    <span><b>{food.fat}g</b> gordura</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!visibleFoodLibrary.length && <Empty>Nenhum alimento encontrado. Tente outra pesquisa.</Empty>}
          <p className="nutrition-disclaimer">Valores nutricionais aproximados por porção. As fotografias da biblioteca ficam armazenadas no aplicativo para carregar com mais rapidez.</p>
          <a className="food-credits-link" href="/assets/food/food-image-sources.json" target="_blank" rel="noreferrer">Créditos e licenças das fotografias</a>
        </section>
      ) : (
        <>
      <section className="nutrition-calendar">
        <div className="section-head">
          <div>
            <span className="eyebrow">CALENDÁRIO VISUAL</span>
            <h2>Escolha o dia</h2>
          </div>
          <span className="pill">30 DIAS</span>
        </div>
        <div className="nutrition-day-strip" aria-label="Dias do plano alimentar">
          {Array.from({ length: 30 }, (_, i) => (
            <button
              type="button"
              className={`nutrition-day-button ${Number(day) === i + 1 ? "selected" : ""} ${nutritionTracking.days[i]?.nutritionMissed ? "missed" : nutritionTracking.days[i]?.nutritionDone ? "done" : ""}`}
              aria-label={`Selecionar dia ${i + 1}`}
              title={nutritionTracking.days[i]?.nutritionMissed ? "Alimentação perdida" : nutritionTracking.days[i]?.nutritionDone ? "Todas as refeições concluídas" : "Dia por cumprir"}
              aria-pressed={Number(day) === i + 1}
              onClick={() => setDay(i + 1)}
              key={i + 1}
            >
              <strong>{String(i + 1).padStart(2, "0")}</strong>
            </button>
          ))}
        </div>
        <p className="nutrition-calendar-note">Verde: todas as refeições marcadas. Vermelho: dia terminado sem concluir todas as refeições. O dia atual só é avaliado quando terminar.</p>
      </section>
      <section className="meal-progress-strip">
        <div>
          <span className="eyebrow">CONSISTÊNCIA DIÁRIA</span>
          <b>{completedMeals} de {n.meals.length} refeições concluídas</b>
        </div>
        <strong>{n.meals.length ? Math.round((completedMeals / n.meals.length) * 100) : 0}%</strong>
        <div className="meal-progress-track"><i style={{ width: `${n.meals.length ? (completedMeals / n.meals.length) * 100 : 0}%` }} /></div>
      </section>
      <section className="training-schedule-card"><div><span className="eyebrow">HORÁRIO PERSONALIZADO</span><b>Treino previsto às {n.training || profile.training_time || "18:00"}</b><p>O pré-treino aparece cerca de 75 minutos antes e o pós-treino cerca de 75 minutos depois. Este horário vem do seu cadastro e pode ser alterado no Perfil.</p></div><button type="button" className="outline" onClick={() => { location.hash = "perfil"; }}>Alterar horário</button></section>
      <section className="meal-timeline">
        {n.meals.map((rawMeal, i) => {
          const meal = mealData(rawMeal),
            key = mealStorageKey(meal, day),
            done = consumed.includes(key);
          return (
            <article
              className={`meal-card ${done ? "meal-consumed" : ""}`}
              key={`${meal.title}-${i}`}
            >
              <div className="meal-time">{meal.time}</div>
              <div className="meal-main">
                <div className="meal-head">
                  {meal.image && (
                    <img
                      className="meal-recipe-thumb"
                      src={meal.image}
                      style={{ "--food-image": `url("${meal.image}")` }}
                      alt={`Fotografia de ${meal.recipeName || meal.title}`}
                      loading="lazy"
                      onError={(event) => { event.currentTarget.style.display = "none"; }}
                    />
                  )}
                  <div>
                    <span className="pill">{meal.title}</span>
                    {meal.recipeName && (
                      <strong className="meal-recipe-name">{meal.recipeName}</strong>
                    )}
                    <p>{meal.purpose || meal.note}</p>
                    <small className="meal-recipe">
                      <b>Preparação:</b> {meal.preparation || meal.recipe}
                    </small>
                  </div>
                </div>
                <div className="meal-total">
                  {n.ageCategory === "adolescente" ? (
                    <><b>Refeição equilibrada</b><span>Sem contagem ou restrição calórica automática para menores.</span></>
                  ) : (
                    <><b>{meal.kcal || 0} kcal</b><span>{meal.protein || 0} g proteína · {meal.carbs || 0} g carboidratos · {meal.fat || 0} g gordura · {meal.fiber || 0} g fibras</span></>
                  )}
                </div>
                <div className="meal-ingredients">
                  <b>Ingredientes e porções estimadas:</b>{" "}
                  {meal.ingredients?.join(" · ") || meal.items.join(" · ")}
                </div>
                {meal.allergyWarning && (
                  <p className="allergy-warning">A receita inclui um ingrediente que coincide com uma restrição do seu perfil. Não consuma esta refeição sem confirmar uma substituição segura.</p>
                )}
                <div className="food-chips">
                  {meal.foods.map((food) => (
                    <div className={`food-chip ${foodPhoto(food) ? "has-photo" : "no-photo"}`} key={food.name}>
                      {foodPhoto(food) ? (
                        <span className="food-chip-media" style={{ "--food-image": `url("${foodPhoto(food)}")` }}>
                          <><img src={foodPhoto(food)} alt={`Fotografia de ${food.name}`} loading="lazy" onError={(event) => { event.currentTarget.hidden = true; event.currentTarget.nextElementSibling.hidden = false; }} /><span className="food-photo-placeholder small" hidden>Fotografia indisponível</span></>
                        </span>
                      ) : <span className="food-photo-placeholder small">Fotografia indisponível</span>}
                      <div>
                        <b>{food.name}</b>
                        <small>{food.portion}{n.ageCategory === "adolescente" ? "" : ` · ${food.kcal} kcal · ${food.protein} g proteína`}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="meal-actions">
                  <button
                    type="button"
                    className={done ? "outline" : "primary"}
                    onClick={() => markConsumed(key)}
                  >
                    {done ? "Consumida ✓" : "Marcar como consumida"}
                  </button>
                  <button
                    type="button"
                    className="outline"
                    onClick={() => replaceMeal(meal)}
                  >
                    Substituir refeição
                  </button>
                </div>
                {replaced[rawMeal.title]?.length && (
                  <p className="replacement-note">
                    Substituição inteligente aplicada, respeitando grupos
                    nutricionais. Pode voltar ao plano original ao trocar de
                    dia.
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </section>
      <section className="hydration-card">
        <div>
          <span className="eyebrow">HIDRATAÇÃO INDIVIDUAL</span>
          <h2>{(n.waterMl / 1000).toFixed(1)} L estimados hoje</h2>
          <p>
            Calculado com peso, idade, atividade, duração, intensidade e calor
            informado. Não force água em excesso.
          </p>
          <div
            className="hydration-progress"
            aria-label={`${waterMl} ml de ${n.waterMl || 0} ml de água registrados`}
          >
            <div>
              <b>{(waterMl / 1000).toFixed(1)} L</b>
              <span> de {(n.waterMl / 1000).toFixed(1)} L</span>
            </div>
            <i>
              <em
                style={{
                  width: `${Math.min(100, Math.round((waterMl / Math.max(1, n.waterMl)) * 100))}%`,
                }}
              />
            </i>
          </div>
          <div className="hydration-actions">
            <button
              type="button"
              className="outline"
              onClick={() => setWaterMl((value) => Math.max(0, value - 250))}
            >
              − 250 ml
            </button>
            <button
              type="button"
              className="primary"
              onClick={() =>
                setWaterMl((value) =>
                  Math.min(n.waterMl || value + 250, value + 250),
                )
              }
            >
              + 250 ml
            </button>
          </div>
        </div>
        <div className="hydration-reminders">
          {(n.hydrationReminders || []).map((item) => (
            <span key={item.label}>💧 {item.label}</span>
          ))}
        </div>
      </section>
      <div className="nutrition-grid">
        {n.eligibleForSupplement && (
          <section className="nutrition-card supplement-recommendation">
            <span className="eyebrow">OPCIONAL · SUPLEMENTAÇÃO</span>
            <h2>Creatina NPL</h2>
            <div className="supplement-product">
              <img
                src={supplementCatalog[0].image}
                alt="Embalagem NPL Creatine Monohydrate"
              />
              <div>
                <b>NPL Creatine Monohydrate</b>
                <p>
                  Produto opcional. Não substitui refeições nem avaliação
                  profissional.
                </p>
                <div className="supplement-actions">
                  <a
                    className="outline"
                    href={supplementCatalog[0].url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver produto oficial
                  </a>
                  <a
                    className="primary"
                    href={supplementCatalog[0].whatsapp}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Perguntar no WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
        <section className="nutrition-card">
          <span className="eyebrow">ORIENTAÇÃO INDIVIDUAL</span>
          <h2>{n.supplementAdvice?.title || "Sem promessas médicas"}</h2>
          <p>
            {n.supplementAdvice?.detail} {n.creatine} Pessoas com doenças,
            alergias, gravidez, medicamentos ou necessidades clínicas devem
            procurar um profissional.
          </p>
        </section>
      </div>
      <p className="nutrition-disclaimer">
        As calorias e quantidades são estimativas educativas calculadas
        individualmente. Objetivos de emagrecimento, cutting, bulking e
        suplementos não são prescrição médica.
      </p>
        </>
      )}
      {shoppingOpen && (
        <div className="shopping-layer" role="dialog" aria-modal="true" aria-label="Lista de compras">
          <button type="button" className="shopping-overlay" aria-label="Fechar lista de compras" onClick={() => setShoppingOpen(false)} />
          <section className="shopping-drawer">
            <div className="shopping-drawer-head">
              <div><span className="eyebrow">COMPRAS CALCULADAS</span><h2>O que comprar</h2><p>{profile.household_size || profile.people_count || 1} pessoa(s) · {shoppingList.length} itens</p></div>
              <button type="button" className="icon-btn" onClick={() => setShoppingOpen(false)} aria-label="Fechar">×</button>
            </div>
            <label className="shopping-period">Período<select value={shoppingDays} onChange={(e) => setShoppingDays(Number(e.target.value))}><option value="7">7 dias</option><option value="14">14 dias</option><option value="30">30 dias</option></select></label>
            <p className="shopping-drawer-note">Quantidades calculadas a partir das refeições da modalidade atual e multiplicadas pelo número de pessoas.</p>
            <div className="shopping-check-summary">
              <b>{shoppingList.filter((item) => shoppingChecked[item.key]).length} de {shoppingList.length} itens marcados</b>
              <button type="button" className="text-btn" onClick={() => setShoppingState({key:shoppingStorageKey,items:{}})}>Limpar marcados</button>
            </div>
            <div className="shopping-list">
              {shoppingList.map((item) => <label className={shoppingChecked[item.key] ? "shopping-item checked" : "shopping-item"} key={item.key}>
                <input type="checkbox" checked={Boolean(shoppingChecked[item.key])} onChange={(event) => setShoppingState((current) => ({key:shoppingStorageKey,items:{...current.items,[item.key]:event.target.checked}}))} />
                <span><b>{item.name}</b><small>{item.display}</small></span>
              </label>)}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
