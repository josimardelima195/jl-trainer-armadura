import React, { useEffect, useState } from "react";
import {
  Home,
  Dumbbell,
  TrendingUp,
  UserRound,
  Trophy,
  MessageCircle,
  LogOut,
  Bell,
  Search,
  ArrowUpRight,
  Menu,
  Utensils,
  Palette,
  ChevronRight,
} from "lucide-react";
import { supabase } from "./lib/supabase";
import { useStore } from "./lib/store";
import { activePlan, stats, modalities as modalityCatalog } from "./lib/model";
import { Title, Stat, Empty, LeoMascot } from "./components/UI";
import {
  Workouts,
  Progress,
  Profile,
  Plans,
  Assistant,
  Nutrition,
  Challenges,
} from "./components/Pages";
import Admin from "./components/Admin";
import { useLanguage, uiText } from "./lib/i18n";
import { foodLibrary, nutritionPlan } from "./lib/nutrition";
function WelcomeTutorial({ onClose, go }) {
  const [step, setStep] = useState(0);
  const items = [
    [
      "Seu painel inicial",
      "Aqui você acompanha a sequência, o próximo treino e a evolução dos seus dados.",
      "inicio",
    ],
    [
      "Treinos personalizados",
      "Escolha o dia, a dificuldade e o equipamento. O programa considera seu objetivo, idade e experiência.",
      "treinos",
    ],
    [
      "Alimentação no seu horário",
      "Veja refeições, calorias, água e preparo organizados ao redor do horário do seu treino.",
      "nutricao",
    ],
    [
      "Progresso e notificações",
      "Registre seus treinos, fotos e medidas. Ative as notificações no Perfil para receber lembretes.",
      "progresso",
    ],
  ];
  const current = items[step];
  return (
    <div className="tutorial-backdrop">
      <section className="tutorial-card">
        <div className="tutorial-mascot">
          <LeoMascot size={100} />
        </div>
        <span className="eyebrow">COMECE COM O JL TRAINER</span>
        <h2>{current[0]}</h2>
        <p>{current[1]}</p>
        <div className="tutorial-dots">
          {items.map((_, i) => (
            <i className={i === step ? "active" : ""} key={i} />
          ))}
        </div>
        <div className="tutorial-actions">
          <button className="text-btn" onClick={onClose}>
            Pular tutorial
          </button>
          {step < items.length - 1 ? (
            <button
              className="primary"
              onClick={() => {
                go(current[2]);
                setStep(step + 1);
              }}
            >
              Próximo <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="primary"
              onClick={() => {
                localStorage.setItem("jl-tutorial-done", "1");
                onClose();
                go("inicio");
              }}
            >
              Começar <ChevronRight size={16} />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
function NutritionOnboarding({ profile, userId, mutate }) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    birth_date: profile.birth_date || "",
    sex: profile.sex || "",
    current_weight: profile.current_weight || "",
    height: profile.height || "",
    goal: normalizeGoal(profile.goal),
    modality: ["Musculação", "Calistenia", "Karatê", "Futsal", "Natação"].includes(profile.modality) ? profile.modality : "Musculação",
    training_location: profile.training_location === "ginasio" ? "ginasio" : "casa",
    training_level: profile.training_level || "beginner",
    training_days_count: Number(profile.training_days_count || profile.training_frequency || 3),
    training_time: String(profile.training_time || "18:00").slice(0, 5),
    training_duration: Number(profile.training_duration || 45),
    daily_activity: profile.daily_activity || "moderate",
    training_intensity: profile.training_intensity || "moderate",
    food_budget: profile.food_budget || "medium",
    allergies: profile.allergies || "",
    foods_to_avoid: profile.foods_to_avoid || profile.food_dislikes || "",
    food_preferences: profile.food_preferences || "",
  });
  const [foods, setFoods] = useState(() => String(profile.available_foods || "").split(",").map((x) => x.trim()).filter(Boolean));
  const [supplements, setSupplements] = useState(() => Array.isArray(profile.supplements) ? profile.supplements : []);

  function normalizeGoal(value) {
    const goal = String(value || "").toLowerCase();
    if (goal.includes("emagrec")) return "emagrecimento";
    if (goal.includes("bulking") || goal.includes("ganho") || goal.includes("massa")) return "bulking";
    if (goal.includes("cutting") || goal.includes("defini")) return "definicao";
    if (goal.includes("manut")) return "manutencao";
    return "condicionamento";
  }
  const age = (() => {
    if (!form.birth_date) return null;
    const birth = new Date(form.birth_date + "T00:00:00");
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) years -= 1;
    return years;
  })();
  const steps = [
    ["basics", "Seus dados básicos", "Precisamos deles para calcular estimativas ajustadas à sua idade e medidas."],
    ["goal", "O que quer alcançar?", "Escolha seu objetivo e a modalidade que prefere praticar."],
    ["routine", "Sua rotina de treino", "Vamos adaptar o plano ao lugar, aos dias e ao tempo que você tem."],
    ["nutrition", "Sua alimentação", "Conte-nos sobre alergias e orçamento. Estes campos podem ficar em branco."],
    ["foods", "Alimentos do seu dia a dia", "Opcional: marque o que costuma encontrar para personalizar as refeições."]
  ];
  const [currentKey, title, description] = steps[step];
  const update = (key, value) => {
    setError("");
    setForm((current) => ({ ...current, [key]: value }));
  };
  const foodChoices = foodLibrary.filter((food) => [
    "Aveia", "Banana", "Ovos", "Leite", "Iogurte natural", "Arroz cozido",
    "Batata-doce", "Mandioca", "Xima", "Feijão cozido", "Peixe grelhado",
    "Frango grelhado", "Carne magra", "Couve e tomate", "Papaia", "Laranja",
    "Manga", "Abacate", "Amendoim", "Caril de amendoim"
  ].includes(food.name));
  const supplementChoices = ["Creatina", "Whey protein", "Cafeína", "Pré-treino"];
  const defaultTrainingDays = (count) => ({
    2: ["Seg", "Qui"],
    3: ["Seg", "Qua", "Sex"],
    4: ["Seg", "Ter", "Qui", "Sáb"],
    5: ["Seg", "Ter", "Qua", "Sex", "Sáb"],
    6: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  })[count] || ["Seg", "Qua", "Sex"];
  function validate() {
    if (currentKey === "basics") {
      if (!form.birth_date || age === null || age < 12 || age > 100) return "Informe uma data de nascimento válida.";
      if (!Number(form.current_weight) || Number(form.current_weight) < 25 || Number(form.current_weight) > 300) return "Informe um peso entre 25 e 300 kg.";
      if (!Number(form.height) || Number(form.height) < 120 || Number(form.height) > 230) return "Informe uma altura entre 120 e 230 cm.";
    }
    if (currentKey === "goal" && (!form.goal || !form.modality)) return "Escolha um objetivo e uma modalidade.";
    if (currentKey === "routine") {
      if (Number(form.training_days_count) < 2 || Number(form.training_days_count) > 6) return "Escolha entre 2 e 6 dias por semana.";
      if (Number(form.training_duration) < 10 || Number(form.training_duration) > 180) return "Escolha uma duração entre 10 e 180 minutos.";
    }
    return "";
  }
  async function finish() {
    const validation = validate();
    if (validation) { setError(validation); return; }
    setSaving(true);
    setError("");
    const count = Number(form.training_days_count) || 3;
    const payload = {
      birth_date: form.birth_date,
      age,
      sex: form.sex || null,
      current_weight: Number(form.current_weight),
      initial_weight: Number(profile.initial_weight) || Number(form.current_weight),
      height: Number(form.height),
      goal: form.goal,
      modality: form.modality,
      equipment_preference: form.training_location === "ginasio" ? "Com equipamento" : "Sem equipamento",
      training_level: form.training_level,
      training_days_count: count,
      training_frequency: count,
      training_days: Array.isArray(profile.training_days) && profile.training_days.length === count ? profile.training_days : defaultTrainingDays(count),
      training_time: form.training_time || "18:00",
      training_duration: Number(form.training_duration) || 45,
      daily_activity: form.daily_activity,
      training_intensity: form.training_intensity,
      food_budget: form.food_budget,
      allergies: form.allergies.trim(),
      foods_to_avoid: form.foods_to_avoid.trim(),
      food_preferences: form.food_preferences.trim(),
      available_foods: foods.join(", "),
      supplements,
      household_size: Number(profile.household_size) || 1,
      onboarding_completed: true,
    };
    const ok = await mutate("profiles", payload, userId);
    setSaving(false);
    if (!ok) setError("Não foi possível guardar os dados. Verifique a ligação e tente novamente.");
  }
  const goalOptions = [
    ["emagrecimento", "Emagrecimento", "Redução gradual de peso e hábitos sustentáveis."],
    ["bulking", "Ganho de massa", "Aumentar força e massa muscular gradualmente."],
    ["definicao", "Cutting / definição", "Preservar força e reduzir gordura corporal."],
    ["condicionamento", "Condicionamento", "Melhorar resistência, mobilidade e energia."],
    ["manutencao", "Manutenção", "Manter consistência e melhorar a capacidade física."],
  ];
  const modalityOptions = ["Musculação", "Calistenia", "Karatê", "Futsal", "Natação"];
  return (
    <div className="nutrition-onboarding-backdrop">
      <section className="nutrition-onboarding onboarding-single-question">
        <div className="onboarding-top">
          <div>
            <span className="eyebrow">PERSONALIZAÇÃO JL TRAINER</span>
            <h2>Vamos preparar o seu plano</h2>
            <p>Uma pergunta por vez. Pode voltar, alterar respostas e deixar os campos opcionais em branco.</p>
          </div>
          <div className="onboarding-leo"><LeoMascot size={82} /></div>
        </div>
        <div className="onboarding-progress-copy"><span>Passo {step + 1} de {steps.length}</span><b>{Math.round(((step + 1) / steps.length) * 100)}%</b></div>
        <div className="onboarding-progress-track"><span style={{ width: ((step + 1) / steps.length) * 100 + "%" }} /></div>
        <div className="onboarding-question">
          <h3>{title}</h3>
          <p>{description}</p>
          {currentKey === "basics" && (
            <div className="onboarding-field-stack">
              <label className="onboarding-single-field">Data de nascimento<input type="date" max={new Date().toISOString().slice(0, 10)} value={form.birth_date} onChange={(e) => update("birth_date", e.target.value)} /></label>
              <div className="onboarding-choice-block">
                <span>Sexo para estimativa energética <small>(opcional)</small></span>
                <div className="onboarding-choice-grid onboarding-choice-grid-three">{[["", "Prefiro não informar"], ["feminino", "Feminino"], ["masculino", "Masculino"]].map(([value, label]) => <button type="button" key={value || "none"} className={form.sex === value ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("sex", value)}><strong>{label}</strong></button>)}</div>
              </div>
              <div className="onboarding-field-pair">
                <label className="onboarding-single-field">Peso (kg)<input type="number" min="25" max="300" step="0.1" inputMode="decimal" placeholder="Ex.: 75" value={form.current_weight} onChange={(e) => update("current_weight", e.target.value)} /></label>
                <label className="onboarding-single-field">Altura (cm)<input type="number" min="120" max="230" step="1" inputMode="numeric" placeholder="Ex.: 175" value={form.height} onChange={(e) => update("height", e.target.value)} /></label>
              </div>
              {age !== null && <p className="onboarding-inline-note">Idade calculada automaticamente: <b>{age} anos</b></p>}
            </div>
          )}
          {currentKey === "goal" && (
            <div className="onboarding-field-stack">
              <div className="onboarding-choice-block"><span>Objetivo principal</span><div className="onboarding-choice-grid">{goalOptions.map(([value, label, detail]) => <button type="button" key={value} className={form.goal === value ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("goal", value)}><strong>{label}</strong><small>{detail}</small></button>)}</div></div>
              <div className="onboarding-choice-block"><span>Modalidade</span><div className="onboarding-choice-grid onboarding-modality-grid onboarding-choice-grid-three">{modalityOptions.map((value) => <button type="button" key={value} className={form.modality === value ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("modality", value)}><strong>{value}</strong></button>)}</div></div>
            </div>
          )}
          {currentKey === "routine" && (
            <div className="onboarding-field-stack">
              <div className="onboarding-choice-block"><span>Onde vai treinar?</span><div className="onboarding-choice-grid onboarding-location-grid onboarding-choice-grid-two"><button type="button" className={form.training_location === "ginasio" ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("training_location", "ginasio")}><strong>Gym</strong><small>Com equipamentos</small></button><button type="button" className={form.training_location === "casa" ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("training_location", "casa")}><strong>Em casa</strong><small>Com ou sem equipamento</small></button></div></div>
              <div className="onboarding-choice-block"><span>Experiência</span><div className="onboarding-choice-grid onboarding-choice-grid-three">{[["beginner", "Estou começando"], ["intermediate", "Já treino"], ["advanced", "Avançada"]].map(([value, label]) => <button type="button" key={value} className={form.training_level === value ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("training_level", value)}><strong>{label}</strong></button>)}</div></div>
              <div className="onboarding-field-pair">
                <label className="onboarding-single-field">Dias por semana<select value={form.training_days_count} onChange={(e) => update("training_days_count", Number(e.target.value))}><option value={2}>2 dias</option><option value={3}>3 dias</option><option value={4}>4 dias</option><option value={5}>5 dias</option><option value={6}>6 dias</option></select></label>
                <label className="onboarding-single-field">Duração<input type="number" min="10" max="180" step="5" inputMode="numeric" value={form.training_duration} onChange={(e) => update("training_duration", e.target.value)} /></label>
              </div>
              <div className="onboarding-field-pair">
                <label className="onboarding-single-field">Horário habitual<input type="time" value={form.training_time} onChange={(e) => update("training_time", e.target.value)} /></label>
                <label className="onboarding-single-field">Atividade diária<select value={form.daily_activity} onChange={(e) => update("daily_activity", e.target.value)}><option value="sedentary">Pouco ativo</option><option value="light">Leve</option><option value="moderate">Moderada</option><option value="active">Muito ativo</option><option value="very_active">Extremamente ativo</option></select></label>
              </div>
              <div className="onboarding-choice-block"><span>Intensidade preferida</span><div className="onboarding-choice-grid onboarding-choice-grid-three">{[["easy", "Leve"], ["moderate", "Moderada"], ["hard", "Alta"]].map(([value, label]) => <button type="button" key={value} className={form.training_intensity === value ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("training_intensity", value)}><strong>{label}</strong></button>)}</div></div>
            </div>
          )}
          {currentKey === "nutrition" && (
            <div className="onboarding-field-stack">
              <div className="onboarding-choice-block"><span>Orçamento alimentar</span><div className="onboarding-choice-grid onboarding-choice-grid-three">{[["low", "Económico"], ["medium", "Moderado"], ["high", "Flexível"]].map(([value, label]) => <button type="button" key={value} className={form.food_budget === value ? "onboarding-choice selected" : "onboarding-choice"} onClick={() => update("food_budget", value)}><strong>{label}</strong></button>)}</div></div>
              <label className="onboarding-single-field">Alergias ou intolerâncias<textarea rows="2" placeholder="Ex.: lactose, amendoim; se não houver, deixe em branco." value={form.allergies} onChange={(e) => update("allergies", e.target.value)} /></label>
              <label className="onboarding-single-field">Alimentos que prefere evitar <small>(opcional)</small><textarea rows="2" placeholder="Ex.: não como carne" value={form.foods_to_avoid} onChange={(e) => update("foods_to_avoid", e.target.value)} /></label>
            </div>
          )}
          {currentKey === "foods" && (
            <div className="onboarding-field-stack">
              <div className="onboarding-choice-block"><span>O que costuma ter em casa? <small>(opcional)</small></span><div className="food-check-grid onboarding-food-grid">{foodChoices.map((food) => <button type="button" key={food.id} className={foods.includes(food.name) ? "food-check selected" : "food-check"} onClick={() => setFoods((current) => current.includes(food.name) ? current.filter((item) => item !== food.name) : [...current, food.name])}><span className="food-choice-emoji" aria-hidden="true">{food.emoji || "🍽️"}</span><b>{food.name}</b></button>)}</div></div>
              <label className="onboarding-single-field">Pratos ou preferências <small>(opcional)</small><textarea rows="2" placeholder="Ex.: matapa, caril de amendoim..." value={form.food_preferences} onChange={(e) => update("food_preferences", e.target.value)} /></label>
              <p className="onboarding-inline-note">Pode deixar tudo em branco. O plano recomendado continua disponível e pode ser alterado no Perfil.</p>
            </div>
          )}
        </div>
        <div className="onboarding-actions">
          <button className="text-btn" type="button" disabled={saving || step === 0} onClick={() => { setError(""); setStep((value) => value - 1); }}>Voltar</button>
          {step < steps.length - 1 ? <button className="primary" type="button" onClick={() => { const message = validate(); if (message) setError(message); else { setError(""); setStep((value) => value + 1); } }}>Continuar <ChevronRight size={16} /></button> : <button className="primary" type="button" disabled={saving} onClick={finish}>{saving ? "A guardar…" : "Criar o meu plano"}</button>}
        </div>
        <p className="onboarding-footnote">Os dados são usados para estimativas educativas. A idade é calculada pela data de nascimento; o peso pode ser atualizado automaticamente pelo registo de progresso.</p>
      </section>
    </div>
  );
}

export default function App() {
  const [language] = useLanguage(),
    t = uiText[language] || uiText.pt;
  const store = useStore(),
    { profile, data, userId, isDemo, error, setError, loading, mutate } = store;
  const [tab, setTab] = useState(location.hash.slice(1) || "inicio"),
    [menu, setMenu] = useState(false),
    [search, setSearch] = useState(""),
    [online, setOnline] = useState(navigator.onLine),
    [theme, setTheme] = useState(() => {
      const saved = localStorage.getItem("jl-theme");
      return saved === "gold" || saved === "light"
        ? "dark"
        : saved === "ocean" || saved === "blue"
          ? "forest"
          : saved === "sprint"
            ? "sprint"
            : saved || "dark";
    }),
    [tutorial, setTutorial] = useState(
      () => localStorage.getItem("jl-tutorial-done") !== "1",
    );
  const { plan, subscription } = activePlan(data, userId),
    visibleModalities = modalityCatalog,
    logs = data.training_logs.filter((x) => x.user_id === userId),
    measures = data.progress_measurements.filter((x) => x.user_id === userId),
    metrics = stats(logs, measures),
    settings = data.settings[0] || {};
  const homeNutrition = nutritionPlan(profile);
  const currentMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  const upcomingMeal = homeNutrition.incomplete ? null : homeNutrition.meals?.find((meal) => {
    const match = String(meal.time || "").match(/(\d{1,2}):(\d{2})/);
    return match && Number(match[1]) * 60 + Number(match[2]) >= currentMinutes;
  }) || homeNutrition.meals?.[0] || null;
  const homeGoal = String(profile.goal || "").toLowerCase();
  const homeFoodFallback = homeGoal.includes("emagrec")
    ? "/assets/food/reference-crops/couve-tomate.webp"
    : homeGoal.includes("bulking") || homeGoal.includes("ganho") || homeGoal.includes("massa")
      ? "/assets/food/recipes/R19.webp"
      : "/assets/food/recipes/R09.webp";
  const leoReminder = upcomingMeal
    ? "Sua próxima refeição é " + String(upcomingMeal.title || "").toLowerCase() + " às " + upcomingMeal.time + "."
    : "Complete os seus dados para o Leo personalizar os lembretes.";
  const leoWaterTarget = homeNutrition.waterMl
    ? (homeNutrition.waterMl / 1000).toFixed(1) + " L"
    : "a sua meta diária";
  const weekActivity = Array.from({ length: 7 }, (_, index) => {
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const date = new Date(today);
    date.setDate(today.getDate() - mondayOffset + index);
    const key = date.toLocaleDateString("en-CA");
    return {
      label: ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"][index],
      count: logs.filter((entry) => new Date(entry.completed_at).toLocaleDateString("en-CA") === key).length,
      today: key === today.toLocaleDateString("en-CA"),
    };
  });
  const weekMax = Math.max(1, ...weekActivity.map((item) => item.count));
  const dailyQuotes = [
    "A consistência transforma pequenos esforços em resultados duradouros.",
    "O treino de hoje é um investimento na sua saúde de amanhã.",
    "Não precisa ser perfeito. Precisa continuar.",
    "Respeite o seu ritmo e mantenha o compromisso com a sua evolução.",
    "Cada refeição equilibrada também faz parte do treino.",
    "A sua melhor competição é com a pessoa que era ontem.",
    "Descanse, alimente-se bem e volte mais forte.",
  ];
  const dailyQuote = dailyQuotes[(new Date().getDate() - 1) % dailyQuotes.length];
  const go = (id) => {
    setTab(id);
    location.hash = id;
    setMenu(false);
    setSearch("");
  };
  useEffect(() => {
    const hash = () => setTab(location.hash.slice(1) || "inicio");
    const net = () => setOnline(navigator.onLine);
    window.addEventListener("hashchange", hash);
    window.addEventListener("online", net);
    window.addEventListener("offline", net);
    return () => {
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("online", net);
      window.removeEventListener("offline", net);
    };
  }, []);
  useEffect(() => {
    const check = () => {
      if (
        !profile.reminders_enabled ||
        typeof Notification === "undefined" ||
        Notification.permission !== "granted"
      )
        return;
      const now = new Date(),
        day = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][now.getDay()],
        days = profile.training_days || [],
        reminderTypes = profile.reminder_types || ["treino", "agua"],
        allows = (type) => reminderTypes.includes(type);
      if (days.length && !days.includes(day)) return;
      const current = now.getHours() * 60 + now.getMinutes();
      const notify = (key, title, body) => {
        const stamp = `jl-reminder-${userId}-${now.toLocaleDateString("en-CA")}-${key}`;
        if (localStorage.getItem(stamp)) return;
        new Notification(title, { body });
        localStorage.setItem(stamp, "1");
      };
      if (allows("treino") && profile.training_time) {
        const [h, m] = String(profile.training_time)
          .slice(0, 5)
          .split(":")
          .map(Number);
        if (Math.abs(current - (h * 60 + m)) <= 2)
          notify(
            `treino-${h}:${m}`,
            "JL Trainer Armadura",
            "Está na hora do seu treino. A sua consistência começa agora.",
          );
      }
      if (
        allows("agua") &&
        current >= 8 * 60 &&
        current <= 20 * 60 &&
        current % 120 <= 2
      )
        notify(
          `agua-${current}`,
          "Hora de beber água",
          "Beba um copo de água e mantenha a hidratação ao longo do dia.",
        );
      const mealTimes = [8 * 60, 11 * 60, 13 * 60, 16 * 60, 19 * 60];
      const mealIndex = mealTimes.findIndex(
        (time) => Math.abs(current - time) <= 2,
      );
      if (allows("refeicao") && mealIndex >= 0)
        notify(
          `refeicao-${mealIndex}`,
          "Sua refeição está próxima",
          "Confira o horário e a receita do seu plano alimentar.",
        );
    };
    check();
    const id = setInterval(check, 15000);
    return () => clearInterval(id);
  }, [
    profile.reminders_enabled,
    profile.training_time,
    profile.training_days,
    profile.reminder_types,
    userId,
  ]);
  const nav = [
      ["inicio", t.home, Home],
      ["treinos", t.workouts, Dumbbell],
      ["nutricao", t.nutrition, Utensils],
      ["progresso", t.progress, TrendingUp],
      ["perfil", t.profile, UserRound],
    ],
    extra = [
      ["modalidades", t.modalities, Dumbbell],
      ["desafios", t.challenges, Trophy],
      ["assistente", t.assistant, MessageCircle],
      ["coach", t.coach, UserRound],
      ["planos", t.plans, Trophy],
      ["notificacoes", t.notifications, Bell],
    ];
  const whatsapp = (message) =>
    `https://wa.me/${(settings.whatsapp || "258868787572").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  const changeTheme = (value) => {
    setTheme(value);
    localStorage.setItem("jl-theme", value);
    window.dispatchEvent(new CustomEvent("jl-theme-change", { detail: value }));
  };
  const common = {
    go,
    plan,
    subscription,
    metrics,
    whatsapp,
    theme,
    onThemeChange: changeTheme,
  };
  return (
    <div className={`shell theme-${theme}`}>
      {menu && (
        <button
          type="button"
          className="drawer-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenu(false)}
        />
      )}
      <aside id="primary-navigation" aria-label="Menu principal" className={menu ? "open" : ""}>
        <div className="brand">
          <div className="brand-mark">JL</div>
          <div>
            <b>JL TRAINER</b>
            <span>ARMADURA</span>
          </div>
        </div>
        <span className="side-label">SUA JORNADA</span>
        {[...nav, ...extra].map(([id, name, Icon]) => (
          <button
            type="button"
            key={id}
            className={`side-btn ${tab === id ? "active" : ""}`}
            onClick={() => go(id)}
          >
            <Icon size={18} />
            {name}
          </button>
        ))}
        <div className="side-bottom">
          <button
            type="button"
            className="side-btn"
            onClick={async () => {
              if (supabase) {
                const { error } = await supabase.auth.signOut();
                if (error) setError(error.message);
              } else location.reload();
            }}
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
      <main>
        <header>
          <button
            type="button"
            className="mobile-menu"
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menu}
            aria-controls="primary-navigation"
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>
          <div className="search">
            <Search size={17} />
            <input
              aria-label="Buscar exercícios ou modalidades"
              placeholder="Buscar exercícios ou modalidades…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="header-actions">
            <span className="pill">{plan.name}</span>
            <div className="theme-switcher" aria-label="Tema do aplicativo">
              <span className="theme-label">Tema</span>
              <button
                className={theme === "dark" ? "active" : ""}
                onClick={() => changeTheme("dark")}
                title="Dark Fitness"
              >
                <Palette size={14} />
              </button>
              <button
                className={theme === "forest" ? "active" : ""}
                onClick={() => changeTheme("forest")}
                title="Forest Flow"
              >
                <i className="theme-dot theme-dot-forest" />
              </button>
              <button
                className={theme === "sprint" ? "active" : ""}
                onClick={() => changeTheme("sprint")}
                title="Sprint Energy"
              >
                <i className="theme-dot theme-dot-sprint" />
              </button>
            </div>
            <button
              className="notification-button"
              aria-label="Abrir notificações"
              onClick={() => go("notificacoes")}
            >
              <span className="notification-icon">
                <Bell size={19} />
                <i aria-hidden="true" />
              </span>
              <span className="notification-label">Avisos</span>
            </button>
            <button
              className="avatar"
              onClick={() => go("perfil")}
              aria-label="Perfil"
            >
              {profile.full_name.slice(0, 2).toUpperCase()}
            </button>
          </div>
        </header>
        {isDemo && (
          <div className="demo-banner">
            PRÉVIA • Dados de exemplo e alterações temporárias. Configure o
            Supabase para login e gravação reais.
          </div>
        )}
        {!online && (
          <div className="demo-banner">
            Sem conexão. Você pode consultar os dados desta sessão. Reconecte
            para salvar.
          </div>
        )}
        {error && (
          <div className="error" role="alert">
            {error}
            <button onClick={() => setError("")} aria-label="Fechar aviso">
              ×
            </button>
          </div>
        )}
        {loading ? (
          <div className="empty">Carregando seus dados…</div>
        ) : (
          <div className="page">
            {search ? (
              <>
                <Title title="Resultados da busca" tag="BIBLIOTECA" />
                {[
                  ...data.exercises.map((e) => ({
                    ...e,
                    destination: "treinos",
                  })),
                  ...visibleModalities.map((e) => ({
                    ...e,
                    destination: "modalidades",
                  })),
                ]
                  .filter((e) =>
                    e.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((e) => (
                    <button
                      key={e.id + e.destination}
                      className="quick-action"
                      onClick={() => go(e.destination)}
                    >
                      {e.name}
                      <ArrowUpRight size={16} />
                    </button>
                  ))}
              </>
            ) : (
              <>
                {tab === "inicio" && (
                  <>
                    <section className="hero">
                      <div className="hero-copy">
                        <p className="eyebrow">SUA JORNADA COMEÇA AQUI</p>
                        <h1>
                          Olá, <span>{(profile.full_name || "atleta").split(" ")[0]}</span>
                        </h1>
                        <p className="muted">
                          Seu treino. Sua evolução. Sua armadura.
                        </p>
                        <button
                          className="primary"
                          onClick={() => go("treinos")}
                        >
                          Começar treino <ArrowUpRight size={17} />
                        </button>
                      </div>
                      <div className="hero-visual">
                        <img
                          src="/assets/home-runner.jpeg"
                          alt="Pessoa correndo durante o treino"
                        />
                        <div className="hero-stat">
                          <strong>{metrics.streak}</strong>
                          <span>dias de sequência</span>
                        </div>
                      </div>
                    </section>
                    <section className="leo-reminder-card" aria-live="polite">
                      <div className="leo-reminder-mascot"><LeoMascot size={74} /></div>
                      <div className="leo-reminder-copy">
                        <span className="eyebrow">LEO · LEMBRETE PERSONALIZADO</span>
                        <strong>{leoReminder}</strong>
                        <p>Não se esqueça da água: meta diária de {leoWaterTarget}.</p>
                      </div>
                      <button type="button" className="outline" onClick={() => go("nutricao")}>Ver alimentação</button>
                    </section>
                    <div className="grid stats home-stats">
                      <Stat label="Dias com treino" value={metrics.total} detail={`${metrics.month} neste mês`} />
                      <Stat label="Sequência atual" value={`${metrics.streak} dias`} detail="Dias consecutivos registados" />
                      <Stat label="Peso atual" value={metrics.current === null ? "—" : `${metrics.current} kg`} detail={metrics.delta === null ? "Registe uma medida" : `${metrics.delta > 0 ? "+" : ""}${metrics.delta.toFixed(1)} kg desde o primeiro registo`} />
                      <Stat label="Meta de energia" value={homeNutrition.calories ? `${homeNutrition.calories} kcal` : "—"} detail={homeNutrition.incomplete ? "Estimativa provisória" : "Meta diária estimada"} />
                    </div>
                    <section className="home-focus-grid">
                      <article className="home-focus-card home-next-meal">
                        <div className="home-focus-image">
                          <img
                            src={upcomingMeal?.image || homeFoodFallback}
                            alt={"Fotografia de " + (upcomingMeal?.recipeName || upcomingMeal?.title || "alimentos saudáveis")}
                            loading="lazy"
                            onError={(event) => {
                              if (event.currentTarget.dataset.fallback !== "true") {
                                event.currentTarget.dataset.fallback = "true";
                                event.currentTarget.src = homeFoodFallback;
                              } else event.currentTarget.style.display = "none";
                            }}
                          />
                        </div>
                        <div className="home-focus-copy">
                          <span className="eyebrow">PRÓXIMA REFEIÇÃO · {upcomingMeal?.time || "PLANO DIÁRIO"}</span>
                          <h3>{upcomingMeal?.recipeName || "O seu plano alimentar"}</h3>
                          <p>{upcomingMeal ? `${upcomingMeal.kcal || 0} kcal estimadas · ${upcomingMeal.title}` : "Complete o perfil para personalizar as refeições."}</p>
                          <button className="text-btn" onClick={() => go("nutricao")}>Abrir alimentação <ArrowUpRight size={15} /></button>
                        </div>
                      </article>
                      <article className="home-focus-card home-water-card">
                        <span className="home-focus-icon">💧</span>
                        <span className="eyebrow">HIDRATAÇÃO DE HOJE</span>
                        <strong>{!homeNutrition.incomplete && homeNutrition.waterMl ? `${(homeNutrition.waterMl / 1000).toFixed(1)} L` : "—"}</strong>
                        <p>{homeNutrition.incomplete ? "Complete o perfil para calcular a meta de hidratação." : "Meta estimada de água, ajustada ao seu perfil e à atividade."}</p>
                        <button className="outline" onClick={() => go("nutricao")}>Registar água</button>
                      </article>
                      <article className="home-focus-card home-motivation-card">
                        <span className="eyebrow">LEMBRETE DO DIA</span>
                        <h3>Continue a construir a sua armadura.</h3>
                        <p>“{dailyQuote}”</p>
                        <button className="text-btn" onClick={() => go("progresso")}>Ver a minha evolução <ArrowUpRight size={15} /></button>
                      </article>
                    </section>
                    <section className="home-week-card">
                      <div className="home-week-heading">
                        <div><span className="eyebrow">ATIVIDADE REGISTADA</span><h2>Sua semana</h2></div>
                        <strong>{weekActivity.reduce((sum, item) => sum + item.count, 0)} <small>treinos</small></strong>
                      </div>
                      <div className="home-week-chart">
                        {weekActivity.map((item) => (
                          <div className={`home-week-day ${item.today ? "today" : ""}`} key={item.label}>
                            <div className="home-week-bar"><i style={{ height: `${item.count ? Math.max(12, (item.count / weekMax) * 100) : 4}%` }} /></div>
                            <span>{item.label}</span>
                            <small>{item.count || "—"}</small>
                          </div>
                        ))}
                      </div>
                      {!weekActivity.some((item) => item.count > 0) && <p className="home-week-empty">Os treinos que registar vão aparecer aqui. Comece com uma sessão e acompanhe a sua consistência.</p>}
                    </section>
                    <div className="home-progress-callout">
                      <div>
                        <span className="eyebrow">ACOMPANHE A MUDANÇA</span>
                        <b>
                          {metrics.total >= 30
                            ? "Plano de 30 dias concluído"
                            : "Foto e peso de evolução"}
                        </b>
                        <p>
                          {metrics.total >= 30
                            ? "Registre agora a foto e o peso do Dia 30 para comparar com o início."
                            : "Registre foto e peso no Progresso para criar a comparação do Dia 0 ao Dia 30."}
                        </p>
                      </div>
                      <button
                        className="outline"
                        onClick={() => go("progresso")}
                      >
                        Ver progresso →
                      </button>
                    </div>
                    <section className="section-head">
                      <div>
                        <p className="eyebrow">CONTINUE SUA JORNADA</p>
                        <h2>Seu próximo treino</h2>
                      </div>
                      <button
                        className="text-btn"
                        onClick={() => go("treinos")}
                      >
                        Ver todos →
                      </button>
                    </section>
                    {data.workouts[0] ? (
                      <div className="today-card">
                        <div className="today-icon">💪</div>
                        <div className="today-info">
                          <span className="pill">SEU PROGRAMA</span>
                          <h3>{data.workouts[0].title}</h3>
                          <p>{data.workouts[0].description}</p>
                        </div>
                        <button
                          className="outline"
                          onClick={() => go("treinos")}
                        >
                          Iniciar
                        </button>
                      </div>
                    ) : (
                      <Empty>Seu coach ainda não publicou um treino.</Empty>
                    )}
                    <section className="section-head">
                      <h2>Encontre sua modalidade</h2>
                      <button
                        className="text-btn"
                        onClick={() => go("modalidades")}
                      >
                        Explorar →
                      </button>
                    </section>
                    <div className="modalities">
                      {visibleModalities.slice(0, 4).map((m, i) => (
                        <button
                          key={m.id}
                          className="mod-card"
                          onClick={() => go("modalidades")}
                        >
                          <div className="mod-emoji">
                            {["🏋️", "💪", "⚡", "🔥"][i]}
                          </div>
                          <h3>{m.name}</h3>
                          <p>{m.description}</p>
                        </button>
                      ))}
                    </div>
                    <div className="guardian">
                      🦁{" "}
                      <span>
                        Leo, seu parceiro: um treino por vez. Registre seu
                        progresso para acompanhar a própria jornada.
                      </span>
                      <button
                        className="text-btn"
                        onClick={() => go("assistente")}
                      >
                        Conversar →
                      </button>
                    </div>
                  </>
                )}
                {tab === "treinos" && <Workouts {...common} />}
                {tab === "nutricao" && <Nutrition {...common} />}
                {tab === "progresso" && <Progress {...common} />}
                {tab === "perfil" && <Profile {...common} />}
                {tab === "planos" && <Plans {...common} />}
                {tab === "assistente" && <Assistant {...common} />}
                {tab === "admin" && <Admin />}
                {tab === "desafios" && <Challenges {...common} />}
                {tab === "modalidades" && (
                  <>
                    <Title
                      tag="OBJETIVO E MOVIMENTO"
                      title="Escolha sua modalidade"
                    />
                    <div className="modalities">
                      {visibleModalities.map((m, i) => (
                        <div key={m.id} className="mod-card">
                          <div className="mod-emoji">
                            {
                              [
                                "🏋️",
                                "💪",
                                "⚡",
                                "🔥",
                                "⚖️",
                                "🏠",
                                "🥋",
                                "⚽",
                                "🏊",
                              ][i % 9]
                            }
                          </div>
                          <h3>{m.name}</h3>
                          <p>{m.description}</p>
                          <button
                            onClick={async () => {
                              if (
                                await mutate(
                                  "profiles",
                                  { modality: m.name },
                                  userId,
                                )
                              )
                                go("treinos");
                            }}
                          >
                            {profile.modality === m.name
                              ? "Selecionada ✓"
                              : "Escolher →"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {tab === "conquistas" && (
                  <>
                    <Title tag="CONSISTÊNCIA REAL" title="Suas conquistas" />
                    <div className="badges">
                      {[
                        ["🔥", "Primeiro treino", metrics.total >= 1],
                        ["⚡", "7 dias seguidos", metrics.streak >= 7],
                        ["💪", "10 treinos", metrics.total >= 10],
                        ["🏆", "30 treinos", metrics.total >= 30],
                      ].map(([icon, label, earned]) => (
                        <div
                          key={label}
                          className={`badge ${earned ? "" : "locked-badge"}`}
                        >
                          <div>{icon}</div>
                          <b>{label}</b>
                          <span>
                            {earned ? "Conquistada" : "Continue sua jornada"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {tab === "coach" && (
                  <>
                    <Title tag="ACOMPANHAMENTO HUMANO" title="Seu coach" />
                    <div className="coach-card">
                      <div className="coach-avatar">JL</div>
                      <div className="coach-info">
                        <h2>{settings.coach_name}</h2>
                        <p>{settings.coach_bio}</p>
                      </div>
                      <a
                        className="primary"
                        href={whatsapp(
                          "Olá! Gostaria de conversar sobre meu treino.",
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Falar no WhatsApp
                      </a>
                    </div>
                    <p className="coach-note">
                      As mentorias e o contacto com o coach aparecem nesta área,
                      sem criar outra aba no menu.
                    </p>
                    {plan.tier > 0 && settings.vip_link ? (
                      <a
                        className="quick-action"
                        href={settings.vip_link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Entrar no grupo VIP →
                      </a>
                    ) : (
                      <Empty>
                        O grupo VIP é liberado para assinantes quando o coach
                        configurar o convite.
                      </Empty>
                    )}
                  </>
                )}
                {tab === "notificacoes" && (
                  <>
                    <Title tag="SUAS ATUALIZAÇÕES" title="Notificações" />
                    {data.notifications.length ? (
                      data.notifications.map((n) => (
                        <div key={n.id} className="event">
                          <div>
                            <b>{n.title}</b>
                            <p>{n.message}</p>
                          </div>
                          {!n.read && (
                            <button
                              className="outline"
                              onClick={() =>
                                mutate("notifications", { read: true }, n.id)
                              }
                            >
                              Marcar como lida
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <Empty>Nenhuma notificação por enquanto.</Empty>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        )}
        <footer>
          JL TRAINER ARMADURA · Acompanhamento físico. Não substitui avaliação
          médica ou nutricional.
        </footer>
      </main>
      {tutorial && (
        <WelcomeTutorial
          go={go}
          onClose={() => {
            localStorage.setItem("jl-tutorial-done", "1");
            setTutorial(false);
          }}
        />
      )}
      {!isDemo && !profile.onboarding_completed && (
        <NutritionOnboarding
          profile={profile}
          userId={userId}
          mutate={mutate}
        />
      )}
      <nav className="bottom-nav">
        {nav.map(([id, name, Icon]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => go(id)}
          >
            <Icon size={20} />
            <span>{name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

