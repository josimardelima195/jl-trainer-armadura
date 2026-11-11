import React, { useEffect, useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { planMatrix, kataCatalog } from "../lib/model";
import { upload, openMedia } from "../lib/storage";
import { Title, Stat, Empty, Locked, Field, Chart } from "./UI";
import {
  build30DayPlan,
  intensityLabels,
  intensityNotes,
  exerciseEquipmentMode,
  normalizeEquipmentSelection,
  modalityKeyFor,
  ageFromProfile,
  samePrimaryMuscle,
  suitableForProfile,
} from "../lib/programs";
import {
  foodLibrary,
  nutritionPlan,
  buildShoppingList,
  estimateWorkoutKcal,
  supplementCatalog,
  foodSubstitutions,
} from "../lib/nutrition";
import { useLanguage, translatedInstructions } from "../lib/i18n";
function ExerciseGif({ exercise, variant = "thumb" }) {
  const [failed, setFailed] = useState(false);
  const source = exercise?.image_path || exercise?.gifUrl;
  return (
    <div className={`exercise-gif exercise-gif-${variant}`}>
      {source && !failed ? (
        <img
          src={source}
          alt={`Demonstração de ${exercise.name}`}
          loading={variant === "guided" ? "eager" : "lazy"}
          fetchPriority={variant === "guided" ? "high" : "low"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="exercise-gif-fallback">GIF indisponível</span>
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
function GuidedWorkout({
  exercises,
  setsFor,
  repsFor,
  onExit,
  onSeriesComplete,
  language,
}) {
  const [index, setIndex] = useState(0),
    [setNumber, setSetNumber] = useState(1);
  const exercise = exercises[index];
  if (!exercise) return null;
  const totalSets = setsFor(exercise),
    instructions = translatedInstructions(exercise, language);
  const complete = () => {
    onSeriesComplete?.(exercise);
    if (setNumber < totalSets) setSetNumber((value) => value + 1);
    else if (index < exercises.length - 1) {
      setIndex((value) => value + 1);
      setSetNumber(1);
    } else onExit();
  };
  return (
    <div className="guided-workout-backdrop" role="dialog" aria-modal="true">
      <div className="guided-workout">
        <div className="guided-head">
          <div>
            <span className="eyebrow">
              TREINO GUIADO · {index + 1}/{exercises.length}
            </span>
            <h2>{exercise.name}</h2>
          </div>
          <button className="outline" type="button" onClick={onExit}>
            Sair ×
          </button>
        </div>
        <div className="guided-media">
          <ExerciseGif exercise={exercise} variant="guided" />
        </div>
        <div className="guided-meta">
          <span className="pill">
            SÉRIE {setNumber} DE {totalSets}
          </span>
          <span className="pill">{repsFor(exercise)} repetições</span>
          <span className="pill">{equipmentLabel(exercise)}</span>
        </div>
        <div className="guided-instructions">
          <h3>Como executar</h3>
          <ol>
            {instructions.length ? (
              instructions.map((step, i) => <li key={i}>{step}</li>)
            ) : (
              <li>
                Faça o movimento devagar, com postura controlada e sem dor.
              </li>
            )}
          </ol>
        </div>
        <div className="guided-actions">
          <button className="primary" type="button" onClick={complete}>
            {setNumber < totalSets
              ? `Concluir série ${setNumber}`
              : index < exercises.length - 1
                ? "Concluir e próximo exercício"
                : "Concluir treino"}
          </button>
          <small>
            Avanço automático após completar as séries deste exercício.
          </small>
        </div>
      </div>
    </div>
  );
}

function IntervalWorkout({
  exercises,
  settings,
  onExit,
  onComplete,
  language,
}) {
  const [index, setIndex] = useState(0),
    [round, setRound] = useState(1),
    [phase, setPhase] = useState("ready"),
    [left, setLeft] = useState(settings.workSeconds);
  const exercise = exercises[index];
  useEffect(() => {
    if (phase === "ready" || phase === "done") return;
    const id = setInterval(
      () =>
        setLeft((value) => {
          if (value > 1) return value - 1;
          return 0;
        }),
      1000,
    );
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (left !== 0 || phase === "ready" || phase === "done") return;
    const isWork = phase === "work";
    if (isWork) {
      window.navigator?.vibrate?.(120);
      setPhase("rest");
      setLeft(settings.restSeconds);
      return;
    }
    window.navigator?.vibrate?.([100, 70, 100]);
    if (round < settings.rounds) {
      setRound((value) => value + 1);
      setPhase("work");
      setLeft(settings.workSeconds);
      return;
    }
    if (index < exercises.length - 1) {
      setIndex((value) => value + 1);
      setRound(1);
      setPhase("work");
      setLeft(settings.workSeconds);
      return;
    }
    setPhase("done");
    onComplete?.();
  }, [left, phase, index, round, settings, onComplete, exercises.length]);
  if (!exercise) return null;
  const start = () => {
    setPhase("work");
    setLeft(settings.workSeconds);
  };
  const label =
    phase === "ready"
      ? "Preparar"
      : phase === "work"
        ? "Movimento"
        : phase === "rest"
          ? "Descanso"
          : "Concluído";
  return (
    <div className="guided-workout-backdrop" role="dialog" aria-modal="true">
      <div className="guided-workout interval-workout">
        <div className="guided-head">
          <div>
            <span className="eyebrow">
              CARDIO GUIADO · {index + 1}/{exercises.length}
            </span>
            <h2>{exercise.name}</h2>
          </div>
          <button className="outline" type="button" onClick={onExit}>
            Sair ×
          </button>
        </div>
        <div className="guided-media">
          <ExerciseGif exercise={exercise} variant="guided" />
        </div>
        <div className="interval-display" aria-live="assertive">
          <span>{label}</span>
          <strong>{left}s</strong>
          <small>
            Rodada {round} de {settings.rounds}
          </small>
        </div>
        <div className="guided-instructions">
          <h3>
            {phase === "rest" ? "Recupere a respiração" : "Como executar"}
          </h3>
          {phase === "rest" ? (
            <p>
              Caminhe devagar, respire e prepare-se para o próximo bloco. O
              aplicativo avança automaticamente.
            </p>
          ) : (
            <ol>
              {translatedInstructions(exercise, language).length ? (
                translatedInstructions(exercise, language).map((step, i) => (
                  <li key={i}>{step}</li>
                ))
              ) : (
                <li>
                  Execute num ritmo confortável, sem dor e sem perder a postura.
                </li>
              )}
            </ol>
          )}
        </div>
        <div className="guided-actions">
          {phase === "ready" && (
            <button className="primary" type="button" onClick={start}>
              Iniciar treino cronometrado
            </button>
          )}
          {phase === "done" && (
            <button className="primary" type="button" onClick={onExit}>
              Finalizar
            </button>
          )}
          <small>
            Alterna movimento e descanso. O telemóvel vibra no momento de trocar
            de fase.
          </small>
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
  if (exercise?.work_seconds)
    return `${exercise.work_seconds} s de movimento · ${exercise.rest_seconds || 30} s de recuperação`;
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
  const [completed, setCompleted] = useState({}),
    [guided, setGuided] = useState(false),
    [timer, setTimer] = useState(0),
    [timerNonce, setTimerNonce] = useState(0),
    [saved, setSaved] = useState(false),
    [logId, setLogId] = useState(() => crypto.randomUUID()),
    [equipment, setEquipment] = useState(
      profile.training_location === "casa"
        ? "Sem equipamento"
        : profile.training_location === "ginasio"
          ? "Com equipamento"
          : "",
    ),
    [place, setPlace] = useState(profile.training_location || ""),
    [mode, setMode] = useState("auto"),
    [intervalSeconds, setIntervalSeconds] = useState(30),
    [intervalLeft, setIntervalLeft] = useState(0),
    [intervalRunning, setIntervalRunning] = useState(false),
    [previewExercise, setPreviewExercise] = useState(null),
    [substitutions, setSubstitutions] = useState({}),
    [programDay, setProgramDay] = useState(1),
    [intensity, setIntensity] = useState("moderate"),
    [libraryLimit, setLibraryLimit] = useState(12);
  const [language] = useLanguage();
  useEffect(() => {
    const idle =
      window.requestIdleCallback || ((callback) => setTimeout(callback, 350));
    const task = idle(() => ensureExerciseLibrary?.());
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(task);
      else clearTimeout(task);
    };
  }, [ensureExerciseLibrary]);
  const allAvailable = (data.workouts || []).filter(
    (workout) => !workout.user_id || workout.user_id === userId,
  );
  const personalized = allAvailable.filter((workout) => {
    const modality = data.modalities.find(
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
        .filter((exercise) => {
          const name = String(exercise.name || "").toLowerCase();
          return !/front lever|muscle up|handstand|clap|pistol|human flag|human flag|planche|frog stand|suspend row|l[- ]?sit|bar spin|release catch/i.test(
            name,
          );
        }),
    [exerciseLibrary, data.exercises, profile.age, profile.training_level],
  );
  const bmi =
    profile.current_weight && profile.height
      ? Number(profile.current_weight) / (Number(profile.height) / 100) ** 2
      : null;
  const goalKey = modalityKeyFor({
    modality: profile.modality,
    goal: profile.goal,
  });
  const age = ageFor(profile);
  const programEquipment =
    equipment ||
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
    ],
  );
  const today = program[programDay - 1] || program[0];
  const isTimedSession =
    today?.sessionType === "interval" || mode === "interval";
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
  const setsFor = (exercise) =>
    age >= 60 ? Math.min(2, exercise.sets || 3) : exercise.sets || 3;
  const repsFor = (exercise) => exercise.reps || "8–12";
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
  const completedDay = trainingLogs.some(
    (log) =>
      Number(log.loads?.program_day) === programDay &&
      String(log.loads?.modality || "") === String(goalKey) &&
      String(log.loads?.equipment || "") === String(equipmentTitle),
  );

  const reset = () => {
    setCompleted({});
    setSaved(false);
    setLogId(crypto.randomUUID());
    setTimer(0);
    setTimerNonce((value) => value + 1);
    setIntervalRunning(false);
    setIntervalLeft(0);
    setLibraryLimit(12);
  };
  useEffect(() => {
    if (!intervalRunning) return;
    const interval = setInterval(
      () =>
        setIntervalLeft((value) => {
          if (value <= 1) {
            setIntervalRunning(false);
            return 0;
          }
          return value - 1;
        }),
      1000,
    );
    return () => clearInterval(interval);
  }, [intervalRunning]);
  return (
    <>
      <Title title="Meus treinos" tag={profile.modality || "SEU PROGRAMA"} />
      <section className="program-panel">
        <div>
          <span className="eyebrow">PROGRAMA PERSONALIZADO</span>
          <h2>30 dias de evolução</h2>
          <p>
            {today?.focus || "Treino guiado"} · {profile.modality || goalKey} ·{" "}
            {equipmentTitle}
          </p>
          <div className="program-focus-tags">
            {(today?.groups || []).map((group) => (
              <span key={group}>
                {group
                  .replace("chest", "peito")
                  .replace("triceps", "tríceps")
                  .replace("back", "costas")
                  .replace("biceps", "bíceps")
                  .replace("legs", "pernas")
                  .replace("glutes", "glúteos")
                  .replace("cardio", "cardio")
                  .replace("core", "abdômen")
                  .replace("shoulders", "ombros")
                  .replace("mobility", "mobilidade")}
              </span>
            ))}
          </div>
        </div>
        <div className="program-choice-block">
          <span className="choice-label">Escolha o dia</span>
          <div className="day-picker">
            {program.map((day) => (
              <button
                type="button"
                className={`day-chip ${programDay === day.day ? "active" : ""}`}
                key={day.day}
                onClick={() => {
                  setProgramDay(day.day);
                  reset();
                }}
              >
                <strong>{day.day}</strong>
                <small>{day.focus}</small>
              </button>
            ))}
          </div>
        </div>
        <div className="program-choice-block difficulty-choice">
          <span className="choice-label">Dificuldade</span>
          <div className="choice-pills">
            {Object.entries(intensityLabels).map(([value, label]) => (
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
        <b>{intensityLabels[intensity]}</b> · {intensityNotes[intensity]}
      </div>
      <section className="exercise-showcase">
        <div className="showcase-heading">
          <div>
            <span className="eyebrow">MOVIMENTOS DO DIA</span>
            <h2>{today?.title || "Treino guiado"}</h2>
            <p>
              {today?.sessionLabel || today?.focus || "Movimentos reais"} · Dia{" "}
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
                  aria-label={`Ver demonstração de ${exercise.name}`}
                >
                  <ExerciseGif exercise={exercise} variant="showcase" />
                </button>
                <div className="showcase-card-copy">
                  <b>{exercise.name}</b>
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
        <button type="button" className="outline active">
          ☷ Lista completa
        </button>
        <button
          type="button"
          className="primary small"
          onClick={() => setGuided(true)}
        >
          ▶ Começar treino guiado
        </button>
      </div>
      {guided &&
        (isTimedSession ? (
          <IntervalWorkout
            exercises={exercises}
            settings={
              today?.interval || {
                workSeconds: intervalSeconds,
                restSeconds: 30,
                rounds: 3,
              }
            }
            language={language}
            onComplete={() =>
              setCompleted(
                Object.fromEntries(
                  exercises.map((exercise) => [exercise.id, setsFor(exercise)]),
                ),
              )
            }
            onExit={() => setGuided(false)}
          />
        ) : (
          <GuidedWorkout
            exercises={exercises}
            setsFor={setsFor}
            repsFor={repsFor}
            language={language}
            onSeriesComplete={(exercise) =>
              setCompleted((current) => ({
                ...current,
                [exercise.id]: Math.min(
                  (current[exercise.id] || 0) + 1,
                  setsFor(exercise),
                ),
              }))
            }
            onExit={() => setGuided(false)}
          />
        ))}
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
            <option value="">Todos os locais</option>
            <option value="ginasio">Ginásio</option>
            <option value="casa">Em casa</option>
          </select>
        </label>
        <label>
          Equipamento
          <select
            value={equipment}
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
        <label>
          Modo
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value)}
          >
            <option value="auto">Automático para o treino do dia</option>
            <option value="series">Séries</option>
            <option value="interval">Intervalado / Tabata</option>
          </select>
        </label>
      </div>
      {mode === "interval" && (
        <div className="interval-controls">
          <label>
            Segundos por bloco
            <input
              type="number"
              min="10"
              max="300"
              step="5"
              value={intervalSeconds}
              onChange={(event) =>
                setIntervalSeconds(Number(event.target.value) || 30)
              }
            />
          </label>
          <button
            className="primary"
            onClick={() => {
              setIntervalLeft(intervalSeconds);
              setIntervalRunning(true);
            }}
          >
            {intervalRunning
              ? `Bloco ativo: ${intervalLeft}s`
              : "Iniciar bloco"}
          </button>
          <button
            className="outline"
            onClick={() => {
              setIntervalRunning(false);
              setIntervalLeft(0);
            }}
          >
            Parar
          </button>
        </div>
      )}
      <div className="workout-banner">
        <div>
          <span className="pill">
            {count} / {total} SÉRIES
          </span>
          <h2>{today?.title || "Treino guiado"}</h2>
          <p>
            {today?.sessionLabel ||
              workout?.description ||
              "Programa de 30 dias com movimentos selecionados para a modalidade."}
          </p>
        </div>
        <div className="timer" aria-live="polite">
          {isTimedSession && intervalRunning ? (
            `${intervalLeft}s`
          ) : (
            <RestClock
              seconds={timer}
              nonce={timerNonce}
              onClear={() => setTimer(0)}
            />
          )}
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
              <h3>{exercise.name}</h3>
              <p>
                Faça este movimento devagar, com postura controlada, amplitude
                confortável e sem dor.
              </p>
              <small>
                {equipmentLabel(exercise)} · trabalha: {muscleLabel(exercise)} ·{" "}
                {loadRecommendation(profile, exercise)} · {setsFor(exercise)}{" "}
                séries de {repsFor(exercise)} · pausa{" "}
                {exercise.rest_seconds || 60}s
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
                  [exercise.id]: (current[exercise.id] || 0) + 1,
                }));
                setTimer(exercise.rest_seconds || 60);
                setTimerNonce((value) => value + 1);
              }}
            >
              {completed[exercise.id] || 0}/{setsFor(exercise)} · Concluir série
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
                program_day: programDay,
                program_modality: goalKey,
                equipment_mode: equipmentTitle,
                notes: fields.notes || "",
                loads: {
                  ...fields,
                  program_day: programDay,
                  intensity,
                  equipment: equipmentTitle,
                  modality: goalKey,
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
          aria-label={`Pré-visualização de ${previewExercise.name}`}
        >
          <div className="exercise-preview-card">
            <div className="exercise-preview-head">
              <div>
                <span className="pill">PRÉ-VISUALIZAÇÃO</span>
                <h2>{previewExercise.name}</h2>
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
  const { data, userId, mutate, busy, setError, refresh } = useStore(),
    [form, setForm] = useState(false),
    [photo, setPhoto] = useState("");
  const rows = data.progress_measurements.filter((r) => r.user_id === userId);
  return (
    <>
      <Title tag="SUA JORNADA EM NÚMEROS" title="Minha evolução">
        <button className="primary small" onClick={() => setForm(!form)}>
          + Registrar medida
        </button>
      </Title>
      <div className="grid stats">
        <Stat
          label="Peso atual"
          value={metrics.current === null ? "—" : `${metrics.current} kg`}
        />
        <Stat label="Treinos" value={metrics.total} />
        <Stat label="Sequência" value={`${metrics.streak} dias`} />
        <Stat
          label="Variação"
          value={
            metrics.delta === null ? "—" : `${metrics.delta.toFixed(1)} kg`
          }
        />
      </div>
      {form && (
        <form
          className="panel-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const f = Object.fromEntries(new FormData(e.currentTarget));
            const payload = Object.fromEntries(
              Object.entries(f).filter(([, v]) => v !== ""),
            );
            if (
              await mutate("progress_measurements", {
                ...payload,
                user_id: userId,
              })
            )
              setForm(false);
          }}
        >
          <div className="form-grid">
            <Field
              label="Data"
              name="measured_at"
              type="date"
              required
              defaultValue={new Date().toLocaleDateString("en-CA")}
            />
            <Field
              label="Peso (kg)"
              name="weight"
              type="number"
              min="20"
              max="400"
              step="0.1"
              required
            />
            {["arm", "chest", "waist", "hip", "thigh"].map((n, i) => (
              <Field
                key={n}
                label={
                  [
                    "Braço (cm)",
                    "Peito (cm)",
                    "Cintura (cm)",
                    "Quadril (cm)",
                    "Coxa (cm)",
                  ][i]
                }
                name={n}
                type="number"
                min="1"
                max="300"
                step="0.1"
              />
            ))}
          </div>
          <button className="primary" disabled={busy}>
            Salvar registro
          </button>
        </form>
      )}
      <div className="progress-card">
        <h2>Histórico de peso</h2>
        <Chart rows={rows} />
      </div>
      <div className="events">
        {[...rows]
          .sort((a, b) => b.measured_at.localeCompare(a.measured_at))
          .map((r) => (
            <div className="event" key={r.id}>
              <div>
                <b>{r.weight} kg</b>
                <small>
                  {r.measured_at} · Cintura: {r.waist || "—"} cm
                </small>
              </div>
              <button
                className="text-btn"
                onClick={() => mutate("progress_measurements", {}, r.id, true)}
              >
                Excluir registro
              </button>
            </div>
          ))}
      </div>
      <h2 className="section-head">Fotos privadas de evolução</h2>
      <section className="progress-photo-timeline">
        <div className="section-head">
          <div>
            <span className="eyebrow">HISTÓRICO VISUAL</span>
            <h2>Antes e depois, no seu ritmo</h2>
          </div>
          <span className="pill">PRIVADO</span>
        </div>
        <p className="muted">
          Registre uma foto no Dia 0 e outra ao concluir o Dia 30. O histórico
          fica privado e organizado para você comparar mudanças reais.
        </p>
        <div className="progress-milestones">
          <span>📸 Dia 0 · início</span>
          <span>🏁 Dia 30 · comparação final</span>
        </div>
        {metrics.total >= 30 && (
          <div className="progress-final-prompt">
            <b>Você chegou aos 30 treinos.</b>
            <span>
              Registre uma nova foto e o peso atual para comparar com o início.
            </span>
          </div>
        )}
      </section>
      <form
        className="panel-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const el = e.currentTarget;
          const f = new FormData(el);
          let path;
          try {
            path = await upload("progress-photos", f.get("photo"), userId);
            if (
              await mutate("progress_photos", {
                user_id: userId,
                path,
                note: String(f.get("note")),
              })
            )
              el.reset();
            else await supabase.storage.from("progress-photos").remove([path]);
          } catch (err) {
            setError(err.message);
          }
        }}
      >
        <label className="file-drop">
          <span>Escolher foto de evolução</span>
          <small>JPG, PNG ou WebP · até 10 MB</small>
          <input
            name="photo"
            type="file"
            required
            accept="image/jpeg,image/png,image/webp"
          />
        </label>
        <Field label="Observação" name="note" maxLength="300" />
        <label className="checkbox">
          <input type="checkbox" required />
          Autorizo guardar esta foto privada para acompanhar meu progresso.
        </label>
        <button className="primary" disabled={busy}>
          Enviar foto privada
        </button>
      </form>
      {data.progress_photos
        .filter((p) => p.user_id === userId)
        .map((p) => (
          <div className="event" key={p.id}>
            <div>
              <b>{p.note || "Registro de evolução"}</b>
              <small>{new Date(p.created_at).toLocaleDateString()}</small>
            </div>
            <button
              className="outline"
              onClick={async () => {
                try {
                  setPhoto(await openMedia("progress-photos", p.path));
                } catch (e) {
                  setError(e.message);
                }
              }}
            >
              Ver foto
            </button>
            <button
              className="text-btn"
              onClick={async () => {
                const { error } = await supabase.storage
                  .from("progress-photos")
                  .remove([p.path]);
                if (error) setError(error.message);
                else {
                  setPhoto("");
                  await mutate("progress_photos", {}, p.id, true);
                  await refresh();
                }
              }}
            >
              Excluir foto
            </button>
          </div>
        ))}
      {photo && (
        <div className="photo-preview">
          <button className="outline" onClick={() => setPhoto("")}>
            Fechar
          </button>
          <img src={photo} alt="Sua foto privada de evolução" />
        </div>
      )}
    </>
  );
}
export function Profile({ theme, onThemeChange }) {
  const { profile, userId, session, data, mutate, busy, isDemo, setError } =
    useStore();
  const [notice, setNotice] = useState(""),
    [avatarPreview, setAvatarPreview] = useState("");
  const [language, setLanguage] = useLanguage();
  return (
    <>
      <Title tag="SEUS DADOS" title="Meu perfil" />
      <form
        className="panel-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = Object.fromEntries(new FormData(e.currentTarget));
          if (
            await mutate(
              "profiles",
              {
                ...f,
                height: f.height ? Number(f.height) : null,
                household_size: f.household_size ? Number(f.household_size) : 1,
                training_frequency: f.training_frequency ? Number(f.training_frequency) : 3,
                food_dislikes: f.foods_to_avoid || "",
                training_days: Array.from(
                  e.currentTarget.elements.training_days?.selectedOptions || [],
                ).map((o) => o.value),
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
            setNotice("Perfil atualizado.");
        }}
      >
        <div className="profile-card">
          <div className="profile-avatar-wrap">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Foto de perfil" />
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
            min="80"
            max="250"
            defaultValue={profile.height || ""}
          />
          <Field
            label="Idade"
            name="age"
            type="number"
            min="13"
            max="100"
            defaultValue={profile.age || ""}
          />
          <label>
            Sexo
            <select name="sex" defaultValue={profile.sex || ""}>
              <option value="">Prefiro não informar</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
            </select>
          </label>
          <Field
            label="Peso atual (kg)"
            name="current_weight"
            type="number"
            min="20"
            max="400"
            step="0.1"
            defaultValue={profile.current_weight || ""}
          />
          <label>
            Nível
            <select
              name="training_level"
              defaultValue={profile.training_level || "beginner"}
            >
              <option value="beginner">Iniciante</option>
              <option value="intermediate">Intermédio</option>
              <option value="advanced">Avançado</option>
            </select>
          </label>
          <label>
            Objetivo
            <select
              name="goal"
              defaultValue={profile.goal || "Condicionamento"}
            >
              {[
                "Musculação",
                "Bulking (ganho de massa)",
                "Definição (cuting)",
                "Emagrecimento",
                "Recomposição corporal",
                "Manutenção de peso",
                "Condicionamento",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
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
            Dias de treino
            <select
              name="training_days"
              multiple
              defaultValue={profile.training_days || ["Seg", "Qua", "Sex"]}
            >
              <option>Seg</option>
              <option>Ter</option>
              <option>Qua</option>
              <option>Qui</option>
              <option>Sex</option>
              <option>Sáb</option>
              <option>Dom</option>
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
            Ativar lembretes no horário escolhido
          </label>
          <fieldset className="reminder-type-options">
            <legend>Quais lembretes deseja receber?</legend>
            {[
              ["treino", "Treino"],
              ["agua", "Água"],
              ["refeicao", "Refeições"],
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
          <div className="profile-section-label">
            <span className="eyebrow">DADOS DA PERSONALIZAÇÃO</span>
            <b>Nutrição, rotina e disponibilidade</b>
          </div>
          <Field
            label="Data de nascimento"
            name="birth_date"
            type="date"
            defaultValue={profile.birth_date || ""}
          />
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
            Atividade diária
            <select
              name="daily_activity"
              defaultValue={profile.daily_activity || "moderate"}
            >
              <option value="sedentary">Pouco ativo</option>
              <option value="light">Levemente ativo</option>
              <option value="moderate">Moderadamente ativo</option>
              <option value="active">Muito ativo</option>
              <option value="very_active">Extremamente ativo</option>
            </select>
          </label>
          <label>
            Intensidade dos treinos
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
            min="1"
            max="7"
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
            Local principal de treino
            <select
              name="training_location"
              defaultValue={profile.training_location || "casa"}
            >
              <option value="casa">Em casa / sem equipamento</option>
              <option value="ginasio">Ginásio</option>
              <option value="ambos">Casa e ginásio</option>
            </select>
          </label>
          <label>
            Orçamento alimentar
            <select
              name="food_budget"
              defaultValue={profile.food_budget || "medium"}
            >
              <option value="low">Económico</option>
              <option value="medium">Moderado</option>
              <option value="high">Flexível</option>
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
            Preferências e pratos locais
            <textarea
              name="food_preferences"
              defaultValue={profile.food_preferences || ""}
            />
          </label>
          <label className="profile-wide-field">
            Suplementos informados
            <textarea
              name="supplements"
              defaultValue={
                Array.isArray(profile.supplements)
                  ? profile.supplements.join(", ")
                  : profile.supplements || ""
              }
            />
          </label>
        </div>
        <button className="primary" disabled={busy}>
          Salvar perfil
        </button>
      </form>
      <section className="language-settings">
        <div>
          <span className="eyebrow">PREFERÊNCIAS</span>
          <h2>Idioma do aplicativo</h2>
          <p>
            Altere os textos principais, navegação e instruções do treino
            guiado.
          </p>
        </div>
        <select
          aria-label="Idioma do aplicativo"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          <option value="pt">Português</option>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </section>
      <section className="theme-settings">
        <div>
          <span className="eyebrow">APARÊNCIA</span>
          <h2>Tema do aplicativo</h2>
          <p>
            Escolha a paleta que deixa o seu treino mais confortável de
            acompanhar. A preferência fica guardada neste dispositivo.
          </p>
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
            <b>Forest Flow</b>
            <small>Verde floresta · terracota</small>
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
            <b>Dark Fitness</b>
            <small>Grafite · verde-lima</small>
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
            <b>Sprint Energy</b>
            <small>Grafite · lima elétrica</small>
          </button>
        </div>
      </section>
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
              setNotice("Foto de perfil atualizada.");
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
            required
          />
        </label>
        <button className="outline" disabled={busy}>
          Guardar foto de perfil
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
function CommunityAvatar({ person }) {
  const [failed, setFailed] = useState(false),
    sex = String(person?.sex || "").toLowerCase(),
    fallback = sex.includes("fem")
      ? "♀"
      : sex.includes("masc")
        ? "♂"
        : String(person?.full_name || "JL")
            .slice(0, 2)
            .toUpperCase();
  return (
    <span className="community-avatar">
      {person?.avatar_url && !failed ? (
        <img
          src={person.avatar_url}
          alt={`Avatar de ${person.full_name || "membro"}`}
          onError={() => setFailed(true)}
        />
      ) : (
        fallback
      )}
    </span>
  );
}
export function Challenges() {
  const { data, userId, profile, mutate, busy } = useStore();
  const today = new Date().toLocaleDateString("en-CA");
  const challenges = (
    data.daily_challenges?.length ? data.daily_challenges : defaultChallenges
  ).filter((item) => item.active !== false);
  const completions = (data.challenge_completions || []).filter(
    (item) =>
      item.user_id === userId &&
      String(item.completed_on || "").slice(0, 10) === today,
  );
  const completedIds = new Set(completions.map((item) => item.challenge_id));
  const complete = async (challenge) => {
    if (completedIds.has(challenge.id) || busy) return;
    await mutate("challenge_completions", {
      id: crypto.randomUUID(),
      user_id: userId,
      challenge_id: challenge.id,
      completed_on: today,
      points: challenge.points,
    });
  };
  const leaderboard = [...(data.community_leaderboard || [])]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 10);
  const myPoints = completions.reduce(
    (sum, item) => sum + Number(item.points || 0),
    0,
  );
  return (
    <>
      <Title tag="CONSISTÊNCIA EM COMUNIDADE" title="Desafios de hoje" />
      <section className="challenge-hero">
        <div>
          <span className="eyebrow">PEQUENAS AÇÕES, RESULTADOS REAIS</span>
          <h2>Seu placar de hoje</h2>
          <p>
            Complete tarefas simples, acompanhe seus pontos e veja a comunidade
            evoluir. Sem batalhas online por enquanto: foco na consistência.
          </p>
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
              return (
                <article
                  className={`challenge-card ${done ? "done" : ""}`}
                  key={challenge.id}
                >
                  <div className="challenge-icon">
                    {challenge.id === "move"
                      ? "⚡"
                      : challenge.id === "water"
                        ? "💧"
                        : challenge.id === "progress"
                          ? "📸"
                          : challenge.id === "consistency"
                            ? "🔥"
                            : "🧘"}
                  </div>
                  <div>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.description}</p>
                    <b>+{challenge.points} pontos</b>
                  </div>
                  <button
                    className={done ? "outline" : "primary"}
                    disabled={busy || done}
                    onClick={() => complete(challenge)}
                  >
                    {done ? "Concluído ✓" : "Concluir"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>
        <aside className="leaderboard-card">
          <div className="section-head">
            <div>
              <span className="eyebrow">COMUNIDADE JL</span>
              <h2>Ranking</h2>
            </div>
            <span className="pill">TOP 10</span>
          </div>
          <p className="leaderboard-note">
            Pontos por treinos registrados e desafios concluídos. O ranking
            mostra apenas dados comunitários básicos.
          </p>
          <div className="leaderboard-list">
            {leaderboard.map((person, index) => (
              <div
                className={`leaderboard-row ${person.id === userId ? "me" : ""}`}
                key={person.id}
              >
                <strong>{index + 1}</strong>
                <CommunityAvatar person={person} />
                <div>
                  <b>{person.full_name || "Membro JL"}</b>
                  <small>
                    {person.workouts || 0} treinos · {person.challenges || 0}{" "}
                    desafios
                  </small>
                </div>
                <span>{person.points || 0}</span>
              </div>
            ))}
          </div>
          {!leaderboard.length && (
            <Empty>Ainda não há pontos no ranking. Seja o primeiro.</Empty>
          )}
        </aside>
      </div>
      <p className="challenge-disclaimer">
        Os pontos são motivacionais e não substituem orientação de treino.
        Prêmios e regras da comunidade devem ser definidos pelo coach antes de
        qualquer campanha.
      </p>
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
      {plan.tier >= 3 && (
        <div className="kata-library">
          <div className="section-head">
            <div>
              <p className="eyebrow">KIMURA SHUKOKAI • PREMIUM</p>
              <h2>Biblioteca de katas</h2>
            </div>
            <a
              className="outline"
              href="https://www.shukokai-skf.com/training-with-skf/kata/"
              target="_blank"
              rel="noreferrer"
            >
              Fonte KSI/SKF
            </a>
          </div>
          <p className="muted">
            Os nomes abaixo seguem o syllabus publicado pela SKF. O link é uma
            referência oficial; a execução, graduação e bunkai devem ser
            confirmadas no dojo.
          </p>
          <div className="kata-grid">
            {kataCatalog.map((k) => (
              <div className="kata-card" key={k.level}>
                <b>{k.level}</b>
                <span>{k.names.join(" · ")}</span>
              </div>
            ))}
          </div>
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
const foodPhoto = (food) => food?.image || null;

export function Nutrition({ plan }) {
  const { profile } = useStore();
  const consumedStorageKey = `jl-meals-consumed-${profile.id || "guest"}`;
  const hydrationStorageKey = `jl-hydration-${profile.id || "guest"}-${new Date().toLocaleDateString("en-CA")}`;
  const [day, setDay] = useState(Number(profile.nutrition_day) || 1),
    [intensity, setIntensity] = useState(
      profile.training_intensity || "moderate",
    ),
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
      training_intensity: intensity,
      nutrition_day: Number(day),
    }),
    kcal = estimateWorkoutKcal(profile, 35, intensity),
    shoppingList = buildShoppingList({ ...profile, training_intensity: intensity }, shoppingDays),
    allowed = (plan?.tier || 0) >= 3;
  const foodGroups = ["Todos", ...new Set(foodLibrary.map((food) => food.group))];
  const visibleFoodLibrary = foodLibrary.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesGroup = foodGroup === "Todos" || food.group === foodGroup;
    return matchesSearch && matchesGroup;
  });
  const completedMeals = n.meals.filter((meal) => consumed.includes(`${day}-${meal.title}`)).length;
  const markConsumed = (key) =>
    setConsumed((list) =>
      list.includes(key) ? list.filter((item) => item !== key) : [...list, key],
    );
  const replaceMeal = (meal) => {
    const alternatives = meal.foods
      .flatMap((food) => foodSubstitutions(food.name))
      .map((name) => foodLibrary.find((food) => food.name === name))
      .filter(Boolean);
    if (alternatives.length)
      setReplaced((current) => ({
        ...current,
        [meal.title]: alternatives.slice(0, 3),
      }));
  };
  const mealData = (meal) => {
    const foods = replaced[meal.title]?.length
      ? replaced[meal.title]
      : meal.foods;
    const sum = (key) =>
      Math.round(foods.reduce((total, food) => total + (food[key] || 0), 0));
    return {
      ...meal,
      foods,
      items: meal.recipeName ? [meal.recipeName] : foods.map((food) => food.name),
      ingredients: meal.ingredients?.length
        ? meal.ingredients
        : foods.map((food) => `${food.name} (${food.portion})`),
      image: meal.image || foods.find((food) => foodPhoto(food))?.image || null,
      kcal: sum("kcal"),
      protein: sum("protein"),
      carbs: sum("carbs"),
      fat: sum("fat"),
      fiber: sum("fiber"),
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
            {n.incomplete ? "complete o perfil" : "kcal estimadas/dia"}
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
                <div className="food-library-image" data-emoji={food.emoji || "🍽️"}>
                  {foodPhoto(food) ? (
                    <img src={foodPhoto(food)} alt={`Fotografia de ${food.name}`} loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement.classList.add("image-fallback"); }} />
                  ) : (
                    <span aria-hidden="true">{food.emoji || "🍽️"}</span>
                  )}
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
          <p className="nutrition-disclaimer">Valores nutricionais aproximados por porção. As imagens externas precisam de ligação à internet; quando uma fotografia não carrega, o aplicativo mostra um ícone de substituição em vez de uma fotografia errada.</p>
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
        <div className="nutrition-day-grid">
          {Array.from({ length: 30 }, (_, i) => (
            <button
              type="button"
              className={`nutrition-day-button ${Number(day) === i + 1 ? "selected" : ""}`}
              aria-label={`Selecionar dia ${i + 1}`}
              aria-pressed={Number(day) === i + 1}
              onClick={() => setDay(i + 1)}
              key={i + 1}
            >
              <span>Dia</span>
              <strong>{String(i + 1).padStart(2, "0")}</strong>
            </button>
          ))}
        </div>
        <p className="nutrition-calendar-note">Selecione um dos 30 dias para consultar as refeições, porções e horários previstos para a sua rotina.</p>
      </section>
      <section className="meal-progress-strip">
        <div>
          <span className="eyebrow">CONSISTÊNCIA DIÁRIA</span>
          <b>{completedMeals} de {n.meals.length} refeições concluídas</b>
        </div>
        <strong>{n.meals.length ? Math.round((completedMeals / n.meals.length) * 100) : 0}%</strong>
        <div className="meal-progress-track"><i style={{ width: `${n.meals.length ? (completedMeals / n.meals.length) * 100 : 0}%` }} /></div>
      </section>
      <div className="nutrition-controls">
        <label>
          Intensidade do treino
          <select
            value={intensity}
            onChange={(e) => setIntensity(e.target.value)}
          >
            <option value="easy">Fácil</option>
            <option value="moderate">Médio</option>
            <option value="hard">Difícil</option>
          </select>
        </label>
        <div className={`intensity-note intensity-${intensity}`}>
          <b>
            {intensity === "easy"
              ? "Fácil"
              : intensity === "hard"
                ? "Difícil"
                : "Médio"}
          </b>{" "}
          · As porções e o gasto estimado acompanham esta dificuldade.
        </div>
        <div className="budget-note">
          <b>Opção económica:</b> {n.budgetNote}
        </div>
        <div className="nutrition-stat">
          <b>{n.waterMl ? `${(n.waterMl / 1000).toFixed(1)} L` : "—"}</b>
          <small>hidratação estimada</small>
        </div>
        <div className="nutrition-stat">
          <b>{n.proteinTarget ?? "—"} g</b>
          <small>proteína alvo</small>
        </div>
        <div className="nutrition-stat">
          <b>{n.carbsTarget ?? "—"} g</b>
          <small>carboidratos alvo</small>
        </div>
        <div className="nutrition-stat">
          <b>{n.fatTarget ?? "—"} g</b>
          <small>gorduras alvo</small>
        </div>
      </div>
      <section className="training-schedule-card"><div><span className="eyebrow">HORÁRIO PERSONALIZADO</span><b>Treino previsto às {n.training || profile.training_time || "18:00"}</b><p>O pré-treino aparece cerca de 75 minutos antes e o pós-treino cerca de 75 minutos depois. Este horário vem do seu cadastro e pode ser alterado no Perfil.</p></div><button type="button" className="outline" onClick={() => { location.hash = "perfil"; }}>Alterar horário</button></section>
      <button type="button" className="shopping-fab" onClick={() => setShoppingOpen(true)}>
        <span className="shopping-fab-icon">🛒</span>
        <span><b>Lista de compras</b><small>{shoppingList.length} itens calculados para {shoppingDays} dias</small></span>
        <strong>›</strong>
      </button>
      {shoppingOpen && (
        <div className="shopping-layer" role="dialog" aria-modal="true" aria-label="Lista de compras">
          <button type="button" className="shopping-overlay" aria-label="Fechar lista de compras" onClick={() => setShoppingOpen(false)} />
          <aside className="shopping-drawer">
            <div className="shopping-drawer-head">
              <div><span className="eyebrow">COMPRAS CALCULADAS</span><h2>O que comprar</h2><p>{profile.household_size || profile.people_count || 1} pessoa(s) · {shoppingList.length} itens</p></div>
              <button type="button" className="icon-btn" onClick={() => setShoppingOpen(false)} aria-label="Fechar">×</button>
            </div>
            <label className="shopping-period">Período<select value={shoppingDays} onChange={(e) => setShoppingDays(Number(e.target.value))}><option value="7">7 dias</option><option value="14">14 dias</option><option value="30">30 dias</option></select></label>
            <p className="shopping-drawer-note">Quantidades calculadas a partir das refeições da modalidade atual e multiplicadas pelo número de pessoas.</p>
            <div className="shopping-list">
              {shoppingList.map((item) => <label className="shopping-item" key={`${item.name}-${item.unit}`}><input type="checkbox" /><span><b>{item.name}</b><small>{item.display}</small></span></label>)}
            </div>
          </aside>
        </div>
      )}
      <section className="meal-timeline">
        {n.meals.map((rawMeal, i) => {
          const meal = mealData(rawMeal),
            key = `${day}-${meal.title}`,
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
                  <b>{meal.kcal || 0} kcal</b>
                  <span>
                    {meal.protein || 0} g proteína · {meal.carbs || 0} g
                    carboidratos · {meal.fat || 0} g gordura · {meal.fiber || 0}{" "}
                    g fibras
                  </span>
                </div>
                <div className="meal-ingredients">
                  <b>Ingredientes e porções:</b>{" "}
                  {meal.ingredients?.join(" · ") || meal.items.join(" · ")}
                </div>
                <div className="food-chips">
                  {meal.foods.map((food) => (
                    <div
                      className={`food-chip ${foodPhoto(food) ? "has-photo" : "no-photo"}`}
                      key={food.name}
                    >
                      {foodPhoto(food) ? (
                        <span className="food-chip-media" data-emoji={food.emoji || "🍽️"}>
                          <img
                            src={foodPhoto(food)}
                            alt={`Fotografia de ${food.name}`}
                            loading="lazy"
                            onError={(event) => event.currentTarget.parentElement.classList.add("image-fallback")}
                          />
                        </span>
                      ) : (
                        <span className="food-chip-emoji" aria-hidden="true">{food.emoji || "🍽️"}</span>
                      )}
                      <div>
                        <b>{food.name}</b>
                        <small>
                          {food.portion} · {food.kcal} kcal · {food.protein} g
                          proteína
                        </small>
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
    </>
  );
}
