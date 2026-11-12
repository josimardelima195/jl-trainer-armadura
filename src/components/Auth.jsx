import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Provider } from "../lib/store";
export default function Auth({ children }) {
  const [session, setSession] = useState(null),
    [registerStep, setRegisterStep] = useState(1),
    [loading, setLoading] = useState(false),
    [mode, setMode] = useState("login"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [preview, setPreview] = useState(false),
    [registerData, setRegisterData] = useState({});
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let alive = true;
    const timeout = setTimeout(() => {
      if (alive) {
        setLoading(false);
        setError(
          "O servidor demorou a responder. Pode entrar novamente ou explorar a prévia.",
        );
      }
    }, 5000);
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!alive) return;
        clearTimeout(timeout);
        if (error)
          setError(
            "Não foi possível verificar a sessão. Verifique a internet e tente novamente.",
          );
        setSession(data?.session || null);
        setLoading(false);
      })
      .catch(() => {
        if (alive) {
          clearTimeout(timeout);
          setLoading(false);
          setError(
            "Não foi possível contactar o servidor. Verifique a internet e tente novamente.",
          );
        }
      });
    const { data } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    return () => {
      alive = false;
      clearTimeout(timeout);
      data.subscription.unsubscribe();
    };
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    const f = Object.fromEntries(new FormData(e.currentTarget));
    try {
      if (!supabase)
        throw new Error(
          "Configure as duas variáveis do Supabase para ativar o login real.",
        );
      if ((mode === "register" || mode === "reset") && f.password !== f.confirm)
        throw new Error("As senhas não coincidem.");
      const redirect = window.location.origin;
      let r;
      if (mode === "register")
        r = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: {
            emailRedirectTo: redirect,
            data: {
              full_name: f.name,
              age: Number(f.age) || null,
              current_weight: Number(f.current_weight) || null,
              initial_weight: Number(f.current_weight) || null,
              height: Number(f.height) || null,
              sex: f.sex || null,
              training_level: f.training_level || "beginner",
              goal: f.goal || "Condicionamento",
              training_time: f.training_time || "18:00",
              birth_date: f.birth_date || null,
              daily_activity: f.daily_activity || "moderate",
              training_intensity: f.training_intensity || "moderate",
              training_days_count: Number(f.training_days_count) || 3,
              training_duration: Number(f.training_duration) || 45,
              training_location: f.training_location || "casa",
              food_budget: f.food_budget || "medium",
              food_preferences: f.food_preferences || "",
              food_dislikes: f.food_dislikes || "",
              allergies: f.allergies || "",
              dietary_restrictions: f.dietary_restrictions || "",
              available_foods: f.available_foods || "",
              supplements: Array.from(
                e.currentTarget.elements.supplements?.selectedOptions || [],
              ).map((o) => o.value),
              modalities: Array.from(
                e.currentTarget.elements.modalities?.selectedOptions || [],
              ).map((o) => o.value),
              health_consent: true,
              terms_accepted_at: new Date().toISOString(),
            },
          },
        });
      else if (mode === "forgot")
        r = await supabase.auth.resetPasswordForEmail(f.email, {
          redirectTo: redirect,
        });
      else if (mode === "reset")
        r = await supabase.auth.updateUser({ password: f.password });
      else
        r = await supabase.auth.signInWithPassword({
          email: f.email,
          password: f.password,
        });
      if (r.error) throw r.error;
      if (mode === "register")
        setNotice(
          "Confira seu email para confirmar o cadastro. Sua conta começa no plano grátis.",
        );
      if (mode === "forgot")
        setNotice(
          "Se houver uma conta para este email, você receberá o link de recuperação.",
        );
      if (mode === "reset") {
        setNotice("Senha atualizada.");
        setMode("login");
      }
    } catch (e) {
      setError(
        e?.message?.toLowerCase().includes("fetch")
          ? "Não foi possível contactar o servidor. Verifique a internet, desative VPN/bloqueador e tente novamente."
          : e.message || "Não foi possível concluir a operação.",
      );
    } finally {
      setBusy(false);
    }
  }
  if ((session && mode !== "reset") || (!supabase && preview))
    return <Provider session={session}>{children}</Provider>;
  return (
    <div className="auth-page">
      <div className="auth-art">
        <div className="auth-art-image">
          <img src="/assets/hero-athlete.jpeg" alt="Atleta treinando" />
        </div>
        <span className="pill">DISCIPLINA • FORÇA • EVOLUÇÃO</span>
        <h1>
          Sua melhor versão.
          <br />
          <em>Uma escolha por dia.</em>
        </h1>
        <p>Seu treino. Sua evolução. Sua armadura.</p>
        <div className="guardian">
          🦁 <span>Eu sou o Leo. Um passo de cada vez também é progresso.</span>
        </div>
      </div>
      <section className="auth-box">
        <div className="brand">
          <div className="brand-mark">JL</div>
          <div>
            <b>JL TRAINER</b>
            <span>ARMADURA</span>
          </div>
        </div>
        <h2>
          {
            {
              login: "Bem-vindo de volta",
              register: "Comece sua jornada",
              forgot: "Recuperar acesso",
              reset: "Definir nova senha",
            }[mode]
          }
        </h2>
        <p>Entre e construa sua consistência.</p>
        <form onSubmit={submit}>
          {mode === "register" && (
            <>
              <div className="register-stepper">
                <span className={registerStep === 1 ? "active" : ""}>
                  1 · Dados
                </span>
                <span className={registerStep === 2 ? "active" : ""}>
                  2 · Seu ponto de partida
                </span>
              </div>
              {registerStep === 1 && (
                <>
                  <label>Nome completo<input name="name" required maxLength="120" autoComplete="name" /></label>
                  <p className="onboarding-hint">Depois de criar a conta, vamos configurar seu perfil em etapas simples. Você poderá alterar as respostas depois.</p>
                  <button type="button" className="outline" onClick={(event) => { setRegisterData(Object.fromEntries(new FormData(event.currentTarget.form))); setRegisterStep(2); }}>Continuar</button>
                </>
              )}
              {registerStep === 2 && (
                <>
                  <input type="hidden" name="name" value={registerData.name || ""} readOnly />
                  <p className="onboarding-hint">Sua conta está quase pronta. Peso, altura, objetivo, modalidade e rotina serão perguntados depois do primeiro acesso.</p>
                  <button type="button" className="text-btn" onClick={() => setRegisterStep(1)}>← Voltar</button>
                </>
              )}
                </>
              )}
            </>
          )}
          {mode !== "reset" && (
            <label>
              Email
              <input name="email" required type="email" autoComplete="email" />
            </label>
          )}
          {mode !== "forgot" && (
            <label>
              Senha
              <input
                name="password"
                type="password"
                minLength="8"
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </label>
          )}
          {(mode === "register" || mode === "reset") && (
            <label>
              Confirmar senha
              <input
                name="confirm"
                type="password"
                required
                minLength="8"
                autoComplete="new-password"
              />
            </label>
          )}
          {mode === "register" && (
            <label className="checkbox">
              <input type="checkbox" required />
              Li os termos abaixo e autorizo o armazenamento privado dos dados
              de treino que eu registrar.
            </label>
          )}
          {!(mode === "register" && registerStep === 1) && (
            <button className="primary" disabled={busy}>
              {busy
                ? "Aguarde…"
                : {
                    login: "Entrar",
                    register: "Criar conta grátis",
                    forgot: "Enviar link",
                    reset: "Salvar senha",
                  }[mode]}
            </button>
          )}
        </form>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="success">
            {notice}
          </p>
        )}
        <div className="auth-links">
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setRegisterStep(1);
              setError("");
            }}
          >
            {mode === "login" ? "Criar conta grátis" : "Voltar ao login"}
          </button>
          {mode === "login" && (
            <button onClick={() => setMode("forgot")}>
              Esqueci minha senha
            </button>
          )}
        </div>
        {!supabase && (
          <button className="outline" onClick={() => setPreview(true)}>
            Explorar prévia sem cadastro
          </button>
        )}
        <details>
          <summary>Termos e privacidade</summary>
          <p>
            Plataforma de acompanhamento físico. Não substitui orientação médica
            ou nutricional. Dados registrados são acessíveis ao titular, à
            administração e ao coach atribuído. Solicite exportação ou exclusão
            pelo perfil. Assinaturas pagas só são liberadas após confirmação
            manual. Esta minuta deve ser completada pelo proprietário com
            contato, entidade responsável e prazos de retenção antes de receber
            clientes reais.
          </p>
        </details>
      </section>
    </div>
  );
}

