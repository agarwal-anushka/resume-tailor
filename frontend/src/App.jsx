import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Vault from "./pages/Vault";
import NewSession from "./pages/NewSession";
import SessionStatus from "./pages/SessionStatus";
import { theme } from "./styles/theme";
import { useState, useEffect } from "react";

/* ── GOOGLE FONTS ── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Instrument+Sans:wght@400;500;600&display=swap');
  `}</style>
);

export default function App() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Landing");

  const goTo = (p) => setPage(p);
  const t = dark ? theme.dark : theme.light;

  useEffect(() => {
    document.documentElement.style.setProperty("--bg", t.bg);
    document.documentElement.style.setProperty("--text", t.text);
    document.documentElement.style.setProperty("--accent", t.accentStrong);
  }, [t]);

  /* 🔥 COMMON NAV BUTTON STYLE */
  const navBtn = {
    background: "transparent",
    border: `1px solid ${t.border2}`,
    color: t.textMid,
    padding: "6px 14px",
    fontSize: 12,
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "'Instrument Sans', sans-serif",
    transition: "all 0.2s",
  };

  const handleHover = (e, enter) => {
    if (enter) {
      e.target.style.border = `1px solid ${t.accentStrong}`;
      e.target.style.color = t.accentStrong;
    } else {
      e.target.style.border = `1px solid ${t.border2}`;
      e.target.style.color = t.textMid;
    }
  };

  return (
    <>
      <FontLoader />

      <div
        style={{
          fontFamily: "'Instrument Sans', sans-serif",
          background: t.bg,
          minHeight: "100vh",
          color: t.text,
        }}
      >
        {/* ── NAVBAR ── */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 300,
            background: t.bg,
            borderBottom: `1px solid ${t.rule}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            height: 44,
          }}
        >
          {/* LOGO */}
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 15,
              fontWeight: 700,
              fontStyle: "italic",
            }}
          >
            Resume Tailor
          </span>

          {/* NAV BUTTONS */}
          <div style={{ display: "flex", gap: 12 }}>
            {page !== "Landing" && (
              <button
                style={navBtn}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
                onClick={() => goTo("Landing")}
              >
                Landing
              </button>
            )}

            {!user && page !== "Login" && page !== "Landing" && (
              <button
                style={navBtn}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
                onClick={() => goTo("Login")}
              >
                Login
              </button>
            )}

            {user && (
              <>
                <button
                  style={navBtn}
                  onMouseEnter={(e) => handleHover(e, true)}
                  onMouseLeave={(e) => handleHover(e, false)}
                  onClick={() => goTo("Vault")}
                >
                  Vault
                </button>

                <button
                  style={navBtn}
                  onMouseEnter={(e) => handleHover(e, true)}
                  onMouseLeave={(e) => handleHover(e, false)}
                  onClick={() => goTo("New Session")}
                >
                  New Session
                </button>

                <button
                  style={navBtn}
                  onMouseEnter={(e) => handleHover(e, true)}
                  onMouseLeave={(e) => handleHover(e, false)}
                  onClick={() => goTo("Session Status")}
                >
                  Session Status
                </button>

                <button
                  style={navBtn}
                  onMouseEnter={(e) => handleHover(e, true)}
                  onMouseLeave={(e) => handleHover(e, false)}
                  onClick={() => {
                    setUser(null);
                    goTo("Landing");
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: "flex", gap: 12 }}>
            {!user && page === "Landing" && (
              <button
                style={navBtn}
                onMouseEnter={(e) => handleHover(e, true)}
                onMouseLeave={(e) => handleHover(e, false)}
                onClick={() => goTo("Login")}
              >
                Login
              </button>
            )}

            <button
              style={navBtn}
              onMouseEnter={(e) => handleHover(e, true)}
              onMouseLeave={(e) => handleHover(e, false)}
              onClick={() => setDark(!dark)}
            >
              {dark ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </div>

        {/* ── PAGES ── */}
        <div style={{ paddingTop: 44 }}>
          {page === "Landing" && <Landing t={t} goTo={goTo} />}

          {page === "Login" && (
            <Login t={t} setUser={setUser} goTo={goTo} />
          )}

          {page === "Vault" && user && (
            <Vault t={t} setPage={goTo} />
          )}

          {page === "New Session" && user && (
            <NewSession t={t} setPage={goTo} />
          )}

          {page === "Session Status" && user && (
            <SessionStatus t={t} />
          )}
        </div>
      </div>
    </>
  );
}