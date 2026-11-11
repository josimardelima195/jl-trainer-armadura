import React, { useEffect, useState } from "react";
import {
  Home,
  Dumbbell,
  TrendingUp,
  UserRound,
  Trophy,
  MessageCircle,
  Settings,
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
import { Title, Stat, Empty } from "./components/UI";
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
import { nutritionPlan } from "./lib/nutrition";
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
        <div className="tutorial-mascot" aria-hidden="true">
          🦁
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
  const [step, setStep] = useState(0),
    [saving, setSaving] = useState(false),
    [foodMode, setFoodMode] = useState(
      profile.available_foods ? "custom" : "recommended",
    ),
    [foods, setFoods] = useState(
      profile.available_foods
        ? String(profile.available_foods).split(",").filter(Boolean)
        : [],
    ),
    [supplements, setSupplements] = useState(
      Array.isArray(profile.supplements) ? profile.supplements : [],
    ),
    [form, setForm] = useState({
      birth_date: profile.birth_date || "",
      sex: profile.sex || "",
      daily_activity: profile.daily_activity || "moderate",
      training_intensity: profile.training_intensity || "moderate",
      training_duration: profile.training_duration || 45,
      training_location: profile.training_location || "casa",
      food_budget: profile.food_budget || "medium",
      allergies: profile.allergies || "",
      food_preferences: profile.food_preferences || "",
    });
  const choices = foodLibrary.filter((food) =>
    [
      "Aveia",
      "Banana",
      "Ovos",
      "Leite",
      "Iogurte natural",
      "Arroz cozido",
      "Batata-doce",
      "Mandioca",
      "Xima",
      "Feijão cozido",
      "Peixe grelhado",
      "Frango grelhado",
      "Carne magra",
      "Couve e tomate",
      "Papaia",
      "Laranja",
      "Manga",
      "Abacate",
      "Amendoim",
      "Caril de amendoim",
      "Esparguete com atum e tomate",
      "Cozido caseiro de ovo, couve e frango",
      "Salada cozida de ovo, couve, frango, batata e cenoura",
    ].includes(food.name),
  );
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  async function finish() {
    setSaving(true);
    await mutate(
      "profiles",
      {
        ...form,
        training_duration: Number(form.training_duration) || 45,
        supplements,
        available_foods: foodMode === "custom" ? foods.join(",") : "",
        onboarding_completed: true,
      },
      userId,
    );
    setSaving(false);
  }
  return (
    <div className="nutrition-onboarding-backdrop">
      <section className="nutrition-onboarding">
        <div className="onboarding-top">
          <div>
            <span className="eyebrow">PERSONALIZAÇÃO JL TRAINER</span>
            <h2>Vamos conhecer a sua rotina</h2>
            <p>
              Estas respostas ficam no seu perfil e ajudam a organizar treino,
              refeições e hidratação. Pode alterar tudo depois.
            </p>
          </div>
          <div className="onboarding-leo">🦁</div>
        </div>
        <div className="onboarding-steps">
          {["Base", "Rotina", "Alimentos", "Suplementos"].map(
            (label, index) => (
              <span className={step === index ? "active" : ""} key={label}>
                {index + 1} · {label}
              </span>
            ),
          )}
        </div>
        {step === 0 && (
          <div className="onboarding-form">
            <label>
              Data de nascimento
              <input
                type="date"
                value={form.birth_date}
                onChange={(e) => update("birth_date", e.target.value)}
              />
            </label>
            <label>
              Sexo usado apenas para estimativa energética
              <select
                value={form.sex}
                onChange={(e) => update("sex", e.target.value)}
              >
                <option value="">Prefiro não informar</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </label>
            <label>
              Orçamento alimentar
              <select
                value={form.food_budget}
                onChange={(e) => update("food_budget", e.target.value)}
              >
                <option value="low">Económico</option>
                <option value="medium">Moderado</option>
                <option value="high">Flexível</option>
              </select>
            </label>
            <label>
              Alergias ou intolerâncias
              <textarea
                value={form.allergies}
                onChange={(e) => update("allergies", e.target.value)}
                placeholder="Ex.: nenhuma, lactose, amendoim…"
              />
            </label>
          </div>
        )}
        {step === 1 && (
          <div className="onboarding-form">
            <label>
              Nível de atividade diária
              <select
                value={form.daily_activity}
                onChange={(e) => update("daily_activity", e.target.value)}
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
                value={form.training_intensity}
                onChange={(e) => update("training_intensity", e.target.value)}
              >
                <option value="easy">Leve</option>
                <option value="moderate">Moderada</option>
                <option value="hard">Alta</option>
              </select>
            </label>
            <label>
              Duração média do treino
              <input
                type="number"
                min="10"
                max="240"
                value={form.training_duration}
                onChange={(e) => update("training_duration", e.target.value)}
              />
            </label>
            <label>
              Onde costuma treinar?
              <select
                value={form.training_location}
                onChange={(e) => update("training_location", e.target.value)}
              >
                <option value="casa">Em casa / sem equipamento</option>
                <option value="ginasio">No ginásio</option>
                <option value="ambos">Casa e ginásio</option>
              </select>
            </label>
            <p className="onboarding-hint">
              O JL Trainer usará estas informações para ajustar as calorias
              estimadas, a hidratação e o horário das refeições.
            </p>
          </div>
        )}
        {step === 2 && (
          <div>
            <p className="onboarding-hint">
              Primeiro escolha como quer montar o plano. Se não selecionar
              alimentos, o aplicativo usa automaticamente o plano recomendado
              normal, sem deixar a alimentação vazia.
            </p>
            <div className="food-mode-options">
              <button
                type="button"
                className={foodMode === "recommended" ? "selected" : ""}
                onClick={() => {
                  setFoodMode("recommended");
                  setFoods([]);
                }}
              >
                <span>✦</span>
                <b>Plano recomendado JL</b>
                <small>
                  O aplicativo combina refeições equilibradas e pratos locais
                  automaticamente.
                </small>
              </button>
              <button
                type="button"
                className={foodMode === "custom" ? "selected" : ""}
                onClick={() => setFoodMode("custom")}
              >
                <span>＋</span>
                <b>Escolher alimentos</b>
                <small>
                  Selecione o que consegue comprar ou costuma ter em casa.
                </small>
              </button>
            </div>
            {foodMode === "custom" && (
              <>
                <p className="onboarding-hint">
                  Não precisa escolher tudo. Escolha apenas o que tem acesso; o
                  restante será completado pelo plano.
                </p>
                <div className="food-check-grid">
                  {choices.map((food) => (
                    <label
                      className={`food-check ${foods.includes(food.name) ? "selected" : ""}`}
                      key={food.id}
                    >
                      <input
                        type="checkbox"
                        checked={foods.includes(food.name)}
                        onChange={(e) =>
                          setFoods((current) =>
                            e.target.checked
                              ? [...current, food.name]
                              : current.filter((name) => name !== food.name),
                          )
                        }
                      />
                      {food.image ? (
                        <img src={food.image} alt="" />
                      ) : (
                        <span>{food.emoji}</span>
                      )}
                      <b>{food.name}</b>
                    </label>
                  ))}
                </div>
                <label className="onboarding-full-label">
                  Outros alimentos ou pratos locais
                  <textarea
                    value={form.food_preferences}
                    onChange={(e) => update("food_preferences", e.target.value)}
                    placeholder="Ex.: matapa, caril de amendoim, esparguete com atum…"
                  />
                </label>
              </>
            )}
          </div>
        )}
        {step === 3 && (
          <div>
            <p className="onboarding-hint">
              Suplementos são opcionais. Primeiro construímos a alimentação;
              depois mostramos apenas informações adequadas ao seu perfil.
            </p>
            <div className="supplement-check-list">
              {[
                "Não utilizo suplementos",
                "Creatina",
                "Whey protein",
                "Pré-treino",
                "Multivitamínico",
              ].map((name) => (
                <label key={name}>
                  <input
                    type="checkbox"
                    checked={supplements.includes(name)}
                    onChange={(e) =>
                      setSupplements((current) =>
                        e.target.checked
                          ? [...current, name]
                          : current.filter((value) => value !== name),
                      )
                    }
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
            <div className="onboarding-note">
              <b>Sem pressão para comprar.</b>
              <span>
                Se escolher creatina, a área Alimentação mostra a NPL como opção
                comercial separada, com fonte oficial e contacto por WhatsApp.
              </span>
            </div>
          </div>
        )}
        <div className="onboarding-actions">
          <button
            className="text-btn"
            type="button"
            onClick={step === 0 ? finish : () => setStep(step - 1)}
          >
            Guardar depois
          </button>
          {step < 3 ? (
            <button
              className="primary"
              type="button"
              onClick={() => setStep(step + 1)}
            >
              Continuar <ChevronRight size={16} />
            </button>
          ) : (
            <button
              className="primary"
              type="button"
              disabled={saving}
              onClick={finish}
            >
              {saving ? "A guardar…" : "Concluir personalização"}
            </button>
          )}
        </div>
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
  const upcomingMeal = homeNutrition.meals?.find((meal) => {
    const match = String(meal.time || "").match(/(\d{1,2}):(\d{2})/);
    return match && Number(match[1]) * 60 + Number(match[2]) >= currentMinutes;
  }) || homeNutrition.meals?.[0] || null;
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
  const initialWeight =
    Number(profile.initial_weight) || Number(measures[0]?.weight) || null;
  const startDate = new Date(profile.created_at || Date.now());
  const daysSinceStart = Math.max(
    0,
    Math.floor((Date.now() - startDate.getTime()) / 86400000) + 1,
  );
  const plannedDays = Math.min(
    30,
    Math.ceil(
      (daysSinceStart / 7) * (Number(profile.training_days_count) || 3),
    ),
  );
  const missedWorkouts = Math.max(0, plannedDays - metrics.total);
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
      ...(profile.role === "admin" || profile.role === "coach"
        ? [["admin", "Gestão", Settings]]
        : []),
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
          className="drawer-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenu(false)}
        />
      )}
      <aside className={menu ? "open" : ""}>
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
            className="mobile-menu"
            aria-label="Abrir menu"
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
                    <div className="grid stats home-stats">
                      <Stat label="Treinos concluídos" value={metrics.total} detail={`${metrics.month} neste mês`} />
                      <Stat label="Sequência atual" value={`${metrics.streak} dias`} detail="Dias consecutivos registados" />
                      <Stat label="Peso atual" value={metrics.current === null ? "—" : `${metrics.current} kg`} detail={metrics.delta === null ? "Registe uma medida" : `${metrics.delta > 0 ? "+" : ""}${metrics.delta.toFixed(1)} kg desde o primeiro registo`} />
                      <Stat label="Meta de energia" value={homeNutrition.calories ? `${homeNutrition.calories} kcal` : "—"} detail={homeNutrition.incomplete ? "Estimativa provisória" : "Meta diária estimada"} />
                    </div>
                    <section className="home-focus-grid">
                      <article className="home-focus-card home-next-meal">
                        <div className="home-focus-image" data-emoji="🥗">
                          {upcomingMeal?.image ? <img src={upcomingMeal.image} alt={`Refeição: ${upcomingMeal.recipeName || upcomingMeal.title}`} loading="lazy" onError={(event) => event.currentTarget.parentElement.classList.add("image-fallback")} /> : <span>🥗</span>}
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
                        <strong>{homeNutrition.waterMl ? `${(homeNutrition.waterMl / 1000).toFixed(1)} L` : "—"}</strong>
                        <p>Meta estimada de água, ajustada ao seu perfil e à atividade.</p>
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
                      <Stat
                        label="Plano atual"
                        value={plan.name}
                        detail={
                          subscription
                            ? `Válido até ${new Date(subscription.expires_at).toLocaleDateString()}`
                            : "Comece no seu ritmo"
                        }
                      />
                      <Stat
                        label="Treinos realizados"
                        value={metrics.total}
                        detail={`${metrics.month} neste mês`}
                      />
                      <Stat
                        label="Peso inicial"
                        value={
                          initialWeight === null ? "—" : `${initialWeight} kg`
                        }
                        detail="Registado no início"
                      />
                      <Stat
                        label="Peso atual"
                        value={
                          metrics.current === null
                            ? "—"
                            : `${metrics.current} kg`
                        }
                        detail="Último registro"
                      />
                      <Stat
                        label="Treinos em falta"
                        value={missedWorkouts}
                        detail="Dias previstos ainda não registados"
                      />
                      <Stat
                        label="Variação de peso"
                        value={
                          metrics.delta === null
                            ? "—"
                            : `${metrics.delta.toFixed(1)} kg`
                        }
                        detail="Entre primeiro e último registro"
                      />
                    </div>
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

