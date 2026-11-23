import React from "react";
import { createRoot } from "react-dom/client";
import Auth from "./components/Auth";
import App from "./App";
import "./styles.css";

class AppStartupBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("JL Trainer failed while rendering:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", background: "#f4f8fd", color: "#172b45", fontFamily: "Arial, sans-serif" }}>
          <section style={{ width: "min(100%, 520px)", padding: "28px", borderRadius: "18px", background: "#fff", border: "1px solid #d9e5f3", boxShadow: "0 18px 50px rgba(20,50,90,.10)" }}>
            <div style={{ width: "48px", height: "48px", display: "grid", placeItems: "center", borderRadius: "14px", background: "#e7f2ff", color: "#1266ce", fontWeight: 800 }}>JL</div>
            <h1 style={{ margin: "20px 0 8px", fontSize: "23px" }}>O JL Trainer encontrou um erro ao iniciar.</h1>
            <p style={{ margin: "0 0 18px", lineHeight: 1.6, color: "#60758f" }}>A aplicação não conseguiu abrir esta página. Os seus dados não foram apagados. Tente carregar novamente.</p>
            <details style={{ marginBottom: "20px", color: "#60758f" }}>
              <summary style={{ cursor: "pointer" }}>Detalhes técnicos</summary>
              <pre style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: "12px" }}>{String(this.state.error?.message || this.state.error || "Erro desconhecido")}</pre>
            </details>
            <button type="button" onClick={() => window.location.reload()} style={{ width: "100%", padding: "13px 18px", border: 0, borderRadius: "10px", background: "#1878e8", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Tentar novamente</button>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <AppStartupBoundary>
    <Auth>
      <App />
    </Auth>
  </AppStartupBoundary>
);

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  navigator.serviceWorker.register("/sw.js?v=7", { updateViaCache: "none" })
    .then((registration) => registration.update())
    .catch((error) => console.warn("JL Trainer service worker registration failed:", error));
}
