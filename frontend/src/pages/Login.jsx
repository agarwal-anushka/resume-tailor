import { useState } from "react";

export default function Login({ t, setUser, goTo }) {
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = () => {
    setUser({ name: "User" });

    if (isSignup) {
      goTo("New Session");
    } else {
      goTo("Vault");
    }
  };

  return (
    <div
      className="page-enter"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100vh - 44px)"
      }}
    >

      {/* LEFT SIDE */}
      <div style={{ padding: "64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        
        <div style={{ fontSize: 12, letterSpacing: "0.1em", color: t.textSub, marginBottom: 16 }}>
          RESUME TAILOR / SIGN IN
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: t.text }}>
          Good to <br />
          <span style={{ color: t.accentStrong, fontStyle: "italic" }}>
            see you.
          </span>
        </h1>

        <div style={{ marginTop: 40 }}>
          <label style={{ fontSize: 12, color: t.textSub }}>EMAIL ADDRESS</label>
          <input
            placeholder="jane@example.com"
            style={{
              width: "100%",
              marginTop: 8,
              marginBottom: 24,
              borderBottom: `1px solid ${t.border2}`,
              background: "transparent",
              color: t.text,
              padding: "8px 0"
            }}
          />

          <label style={{ fontSize: 12, color: t.textSub }}>PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            style={{
              width: "100%",
              marginTop: 8,
              marginBottom: 32,
              borderBottom: `1px solid ${t.border2}`,
              background: "transparent",
              color: t.text,
              padding: "8px 0"
            }}
          />

          {/* 🔥 FIXED BUTTON */}
          <button
            onClick={handleAuth}
            style={{
              width: "100%",
              padding: "16px",
              background: t.accentStrong,   // caramel highlight
              color: t.bg,                 // proper contrast
              border: "none",
              fontWeight: 600,
              letterSpacing: "0.05em",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = 0.85;
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = 1;
            }}
          >
            {isSignup ? "CREATE ACCOUNT →" : "SIGN IN →"}
          </button>

          <p style={{ marginTop: 20, fontSize: 13, color: t.textMid }}>
            New here?{" "}
            <span
              onClick={() => setIsSignup(true)}
              style={{ cursor: "pointer", fontWeight: 600, color: t.accentStrong }}
            >
              Create an account
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          borderLeft: `1px solid ${t.rule}`,
          padding: "64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <div style={{ fontSize: 12, color: t.textSub, marginBottom: 20 }}>
          WHY RESUME TAILOR
        </div>

        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            lineHeight: 1.4,
            color: t.textMid
          }}
        >
          “The gap between a tailored resume and a generic one is often the difference between an interview and silence.”
        </h2>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: t.textSub }}>VAULT ENTRIES</div>
            <div style={{ fontSize: 20, color: t.text }}>Unlimited</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: t.textSub }}>JDS PER SESSION</div>
            <div style={{ fontSize: 20, color: t.text }}>Unlimited</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: t.textSub }}>EXPORT FORMAT</div>
            <div style={{ fontSize: 20, color: t.text }}>DOCX</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: t.textSub }}>PROCESSING</div>
            <div style={{ fontSize: 20, color: t.text }}>Parallel</div>
          </div>
        </div>
      </div>

    </div>
  );
}