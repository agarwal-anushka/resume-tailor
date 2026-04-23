import { useState } from "react";
export default function NewSession({ t, setPage }) {
  const [jds, setJds] = useState([{ id: 1 }, { id: 2 }]);

  return (
    <div className="page-enter" style={{ maxWidth: 860, margin: "0 auto", padding: "56px 32px" }}>

      {/* Header */}
      <div style={{ paddingBottom: 32, borderBottom: `2px solid ${t.text}`, marginBottom: 48, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textSub, marginBottom: 10 }}>New Session</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900, letterSpacing: "-1px" }}>
            Configure Your<br /><em style={{ fontStyle: "italic", color: t.accentStrong }}>Tailoring Run</em>
          </h1>
        </div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: t.textSub }}>
          {jds.length} job description{jds.length !== 1 ? "s" : ""} added
        </div>
      </div>

      {/* Session name */}
      <div style={{ marginBottom: 44 }}>
        <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: t.textSub, marginBottom: 12 }}>Session Name</label>
        <input defaultValue="Frontend Roles — April 2026" style={{ width: "100%", padding: "12px 0", borderBottom: `1.5px solid ${t.border2}`, borderTop: "none", borderLeft: "none", borderRight: "none", background: "transparent", color: t.text, fontSize: 18, fontWeight: 600, letterSpacing: "-0.3px" }} />
      </div>

      {/* JDs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: `2px solid ${t.text}`, marginBottom: 32 }}>
  
  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700 }}>
    New Session
  </h2>

  <div style={{ display: "flex", gap: "10px" }}>
    
    <button
  style={{
    padding: "10px 24px",
    border: `1px solid ${t.border}`,   // ✅ visible border
    background: "transparent",         // ✅ no fill
    color: t.text,                     // ✅ readable text
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s"
  }}
  onMouseEnter={(e) => {
    e.target.style.background = t.surfaceHover;
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "transparent";
  }}
>
  + Add Entry
</button>

    <button
  onClick={() => setPage("New Session")}
  style={{
    padding: "10px 24px",
    border: "none",
    background: t.accentStrong,   // ✅ caramel (visible in both themes)
    color: t.bg,                  // ✅ contrast
    fontSize: 12,
    fontWeight: 600,
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
  New Session →
</button>

  </div>
</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {jds.map((jd, i) => (
            <div key={jd.id} className="jd-block" style={{ border: `1px solid ${t.border2}`, transition: "border-color 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${t.rule}`, background: t.surface }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: t.textMid }}>
                  Job Description {["I","II","III","IV","V","VI"][i] || i+1}
                </span>
                <div style={{ display: "flex", gap: 12 }}>
                  <button style={{ fontSize: 11, background: "none", border: "none", color: t.textSub, cursor: "pointer" }}>↑ Upload PDF</button>
                  {jds.length > 1 && <button onClick={() => setJds(p => p.filter(j => j.id !== jd.id))} style={{ fontSize: 11, background: "none", border: "none", color: t.danger, cursor: "pointer" }}>Remove</button>}
                </div>
              </div>
              <textarea placeholder="Paste the full job description here..." style={{ width: "100%", minHeight: 120, padding: "16px 18px", border: "none", background: "transparent", color: t.textMid, fontSize: 13, lineHeight: 1.75, resize: "vertical" }} />
            </div>
          ))}
        </div>

      {/* Footer actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 32, borderTop: `1px solid ${t.rule}` }}>

  {/* Cancel (secondary text button) */}
  <button
    style={{
      fontSize: 12,
      background: "none",
      border: "none",
      color: t.textSub,
      cursor: "pointer",
      letterSpacing: "0.04em"
    }}
  >
    ← Cancel
  </button>

  {/* Generate (PRIMARY button) */}
  <button
    className="btn-primary"
    onClick={() => setPage("Session Status")}   // ✅ better flow
    style={{
      padding: "14px 40px",
      border: "none",
      background: t.accentStrong,   // 🔥 caramel
      color: t.bg,                  // ✅ contrast
      fontWeight: 600,
      fontSize: 12,
      letterSpacing: "0.06em",
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
    Generate {jds.length} Resume{jds.length !== 1 ? "s" : ""} →
  </button>

</div>
    </div>
  );
}