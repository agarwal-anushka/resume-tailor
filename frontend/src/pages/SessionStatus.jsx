export default function SessionStatus({ t }) {
  const jobs = [];

  const cfg = {
    done:       { label: "Ready to download", color: "#27AE60", dot: true  },
    processing: { label: "Processing…",        color: "#E67E22", dot: true, pulse: true },
    pending:    { label: "Queued",             color: "#6B6A60", dot: false },
  };

  const done = jobs.filter(j => j.status === "done").length;
  const pct  = Math.round((done / jobs.length) * 100);

  return (
    <div className="page-enter" style={{ maxWidth: 800, margin: "0 auto", padding: "56px 32px" }}>

      {/* Header */}
      <div style={{ paddingBottom: 28, borderBottom: `2px solid ${t.text}`, marginBottom: 40 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textSub, marginBottom: 10 }}>
          Session / Frontend Roles — April 2026
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, letterSpacing: "-0.8px" }}>
            {done} of {jobs.length} Resumes <em style={{ fontStyle: "italic", color: t.accentStrong }}>Ready</em>
          </h1>
          <span style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: t.textSub }}>{pct}%</span>
        </div>
        {/* Progress bar — editorial thin rule style */}
        <div style={{ marginTop: 16, height: 3, background: t.border2, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, right: `${100 - pct}%`, background: t.text, transition: "right 0.6s ease" }} />
        </div>
      </div>

      {/* Job rows */}
      <div style={{ marginBottom: 32 }}>
        {jobs.map((j, i) => {
          const s = cfg[j.status];
          return (
            <div key={i} className="entry-row" style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 32, alignItems: "center", padding: "20px 12px", borderBottom: `1px solid ${t.rule}` }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{j.title}</div>
                <div style={{ fontSize: 12, color: t.textSub }}>{j.company}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div className={s.pulse ? "status-dot" : ""} style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: s.color, fontWeight: 500, letterSpacing: "0.02em" }}>{s.label}</span>
              </div>
              {j.status === "done"
                ? <button className="hover-line" style={{ fontSize: 12, background: "none", border: "none", color: t.text, cursor: "pointer", fontWeight: 600, letterSpacing: "0.02em" }}>↓ Download</button>
                : <div style={{ width: 80 }} />
              }
            </div>
          );
        })}
      </div>

      {/* Bulk download */}
      {done === jobs.length
        ? <button
  className="btn-primary"
  style={{
    width: "100%",
    padding: "16px",
    border: "none",
    background: t.accentStrong,   // ✅ caramel highlight
    color: t.bg,                  // ✅ contrast (visible always)
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
  ↓ Download All {jobs.length} Resumes as ZIP
</button>
        : <div style={{ padding: "16px 24px", border: `1px solid ${t.border2}`, fontSize: 12, color: t.textSub, textAlign: "center", letterSpacing: "0.02em", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
            Bulk download will be available when all resumes are complete.
          </div>
      }
    </div>
  );
}
