export default function Landing({ t, goTo }) {
  return (
    <div className="page-enter">
      {/* Masthead rule */}
      <div style={{ borderBottom: `3px double ${t.border2}`, margin: "0 32px" }} />

      {/* Issue line */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 32px", borderBottom: `1px solid ${t.rule}`, fontSize: 10, color: t.textSub, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        <span>Vol. I &nbsp;·&nbsp; Issue 01 &nbsp;·&nbsp; 2026</span>
        <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 12, textTransform: "none", letterSpacing: 0, color: t.textMid }}>The Job Application Review</span>
        <span>AI · Careers · Tools</span>
      </div>

      {/* Hero — magazine front page layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2px 1.6fr 2px 1fr", minHeight: "82vh", borderBottom: `1px solid ${t.rule}` }}>

        {/* Left column — pull quote + stats */}
        <div style={{ padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 22, lineHeight: 1.5, color: t.textMid, marginBottom: 24 }}>
              "Most job seekers skip tailoring entirely. Not because they don't want to — because it takes too long."
            </p>
            <div style={{ width: 32, height: 1.5, background: t.accentStrong, marginBottom: 24 }} />
            <p style={{ fontSize: 11, color: t.textSub, lineHeight: 1.7, letterSpacing: "0.02em" }}>
              Resume Tailor automates the entire process — from experience selection to language rewriting — for every job description you submit.
            </p>
          </div>
          <div style={{ borderTop: `1px solid ${t.rule}`, paddingTop: 24 }}>
            <div style={{ fontSize: 36, fontFamily: "'Playfair Display', serif", fontWeight: 900, letterSpacing: "-1px", color: t.accentStrong }}>10×</div>
            <div style={{ fontSize: 11, color: t.textSub, marginTop: 4, letterSpacing: "0.04em" }}>faster than manual tailoring</div>
          </div>
        </div>

        {/* Vertical rule */}
        <div style={{ background: t.rule }} />

        {/* Center — headline */}
        <div style={{ padding: "48px 48px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", borderTop: "none", position: "relative" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: t.textSub, marginBottom: 28 }}>Featured Tool</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(52px, 7vw, 88px)", fontWeight: 900, lineHeight: 0.95, letterSpacing: "-2px", marginBottom: 32 }}>
            One Profile.<br />
            <em style={{ fontStyle: "italic", color: t.accentStrong }}>Every</em><br />
            Job.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: t.textMid, maxWidth: 380, margin: "0 auto 40px" }}>
            Build your experience vault once. Paste multiple job descriptions. Receive a separately tailored, formatted resume for each — delivered in one go.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => goTo("Login")} style={{ padding: "13px 36px", border: "none", background: t.text, color: t.bg, fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", cursor: "pointer" }}>
              Begin →
            </button>
            <button style={{ padding: "13px 24px", border: `1px solid ${t.border2}`, background: "transparent", color: t.textMid, fontSize: 12, letterSpacing: "0.04em", cursor: "pointer" }}>
              How it works
            </button>
          </div>
        </div>

        {/* Vertical rule */}
        <div style={{ background: t.rule }} />

        {/* Right column — steps */}
        <div style={{ padding: "48px 36px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textSub, marginBottom: 28 }}>How It Works</div>
          {[
            { n: "I", title: "Build Your Vault", body: "Upload your resume or fill manually. Stored as structured records." },
            { n: "II", title: "Input Job Descriptions", body: "Paste one or many JDs in a single session. No limit." },
            { n: "III", title: "Download Tailored Resumes", body: "AI selects and rewrites for each role. One DOCX per JD." },
          ].map((s, i) => (
            <div key={i} style={{ paddingBottom: 24, marginBottom: 24, borderBottom: i < 2 ? `1px solid ${t.rule}` : "none" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: t.accentStrong, marginBottom: 8 }}>{s.n}.</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: t.textMid, lineHeight: 1.65 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom ticker */}
      <div style={{ padding: "12px 32px", borderTop: `1px solid ${t.rule}`, display: "flex", gap: 40, fontSize: 10, color: t.textSub, letterSpacing: "0.08em", textTransform: "uppercase", overflowX: "auto" }}>
        {["✦ AI-powered selection", "✦ Keyword-matched rewriting", "✦ DOCX export", "✦ Parallel processing", "✦ Persistent vault", "✦ Multiple JDs per session", "✦ Free to use"].map((item, i) => (
          <span key={i} style={{ whiteSpace: "nowrap" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

