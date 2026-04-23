import { useState } from "react";
import { login, signup } from "../api";

export default function Login({ t, setUser, goTo }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Step 1 — create account
        await signup({ name, email, password });
        // Step 2 — log in to get token
        const res = await login({ email, password });
        localStorage.setItem("token", res.data.access_token);
        setUser({ name, email });
        goTo("Vault");
      } else {
        const res = await login({ email, password });
        localStorage.setItem("token", res.data.access_token);
        // Store basic user info
        localStorage.setItem("user", JSON.stringify({ email }));
        setUser({ email });
        goTo("Vault");
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map(d => d.msg).join(", "));
      } else {
        setError(detail || "Something went wrong");
      }
    } finally {
      setLoading(false);
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
          RESUME TAILOR / {isSignup ? "SIGN UP" : "SIGN IN"}
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: t.text }}>
          Good to <br />
          <span style={{ color: t.accentStrong, fontStyle: "italic" }}>
            see you.
          </span>
        </h1>

        <div style={{ marginTop: 40 }}>
          {isSignup && (
            <>
              <label style={{ fontSize: 12, color: t.textSub }}>FULL NAME</label>
              <input
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", marginTop: 8, marginBottom: 24, borderBottom: `1px solid ${t.border2}`, background: "transparent", color: t.text, padding: "8px 0", border: "none", borderBottom: `1px solid ${t.border2}`, outline: "none" }}
              />
            </>
          )}

          <label style={{ fontSize: 12, color: t.textSub }}>EMAIL ADDRESS</label>
          <input
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", marginTop: 8, marginBottom: 24, background: "transparent", color: t.text, padding: "8px 0", border: "none", borderBottom: `1px solid ${t.border2}`, outline: "none" }}
          />

          <label style={{ fontSize: 12, color: t.textSub }}>PASSWORD</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginTop: 8, marginBottom: 32, background: "transparent", color: t.text, padding: "8px 0", border: "none", borderBottom: `1px solid ${t.border2}`, outline: "none" }}
          />

          {error && (
            <div style={{ marginBottom: 16, fontSize: 12, color: t.danger, padding: "10px 14px", border: `1px solid ${t.danger}` }}>
              {error}
            </div>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            style={{ width: "100%", padding: "16px", background: t.accentStrong, color: t.bg, border: "none", fontWeight: 600, letterSpacing: "0.05em", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s" }}
          >
            {loading ? "Please wait..." : isSignup ? "CREATE ACCOUNT →" : "SIGN IN →"}
          </button>

          <p style={{ marginTop: 20, fontSize: 13, color: t.textMid }}>
            {isSignup ? "Already have an account? " : "New here? "}
            <span
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              style={{ cursor: "pointer", fontWeight: 600, color: t.accentStrong }}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ borderLeft: `1px solid ${t.rule}`, padding: "64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: 12, color: t.textSub, marginBottom: 20 }}>WHY RESUME TAILOR</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, lineHeight: 1.4, color: t.textMid }}>
          "The gap between a tailored resume and a generic one is often the difference between an interview and silence."
        </h2>
        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[["VAULT ENTRIES", "Unlimited"], ["JDS PER SESSION", "Unlimited"], ["EXPORT FORMAT", "DOCX"], ["PROCESSING", "Parallel"]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 12, color: t.textSub }}>{label}</div>
              <div style={{ fontSize: 20, color: t.text }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}