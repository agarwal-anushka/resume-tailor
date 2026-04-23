import { useState } from "react";
export default function Vault({ t, setPage }) {
  const [active, setActive] = useState("work");

  const nav = [
    { id: "work", label: "Work Experience", count: 3 },
    { id: "projects", label: "Projects", count: 4 },
    { id: "skills", label: "Skills", count: 12 },
    { id: "education", label: "Education", count: 1 },
    { id: "certs", label: "Certifications", count: 2 },
    { id: "achievements", label: "Achievements", count: 3 },
  ];

  const work = [
    { company: "Accenture", role: "Software Engineer", period: "Jan 2023 – Present", bullets: ["Built REST APIs handling 50k+ daily requests", "Cut deployment time 40% via CI/CD pipelines", "Led migration from monolith to microservices architecture"] },
    { company: "Infosys", role: "Associate Developer", period: "Jun 2021 – Dec 2022", bullets: ["Migrated legacy PHP codebase to Node.js", "Mentored 3 junior developers on code review practices"] },
    { company: "TCS", role: "Intern", period: "Jan – May 2021", bullets: ["Developed internal HR dashboard using React and REST APIs"] },
  ];

  const projects = [
    { name: "Business Card Scanner", tech: ["Python", "Tesseract OCR", "SQLite", "Tkinter"], desc: "Extracts and stores contact info from business card images using OCR." },
    { name: "Resume Tailor", tech: ["React", "FastAPI", "PostgreSQL", "Groq LLM"], desc: "AI-powered resume customisation — the very product you're using." },
    { name: "Expense Tracker", tech: ["React Native", "Firebase"], desc: "Mobile budgeting app with alerts, categories, and spending analytics." },
    { name: "Portfolio CMS", tech: ["Next.js", "Sanity.io", "Vercel"], desc: "Headless CMS-driven personal portfolio with integrated blog." },
  ];

  const skills = {
    Technical: ["Python", "React", "FastAPI", "PostgreSQL", "Docker", "Git", "SQL", "REST APIs", "Node.js", "TypeScript"],
    Soft: ["Problem Solving", "Team Leadership"],
  };

  return (
    <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 44px)" }}>

      {/* Sidebar */}
      <div style={{ borderRight: `1px solid ${t.rule}` }}>
        {/* Vault header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: `1px solid ${t.rule}` }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, letterSpacing: "-0.3px" }}>Your Vault</div>
          <div style={{ fontSize: 11, color: t.textSub, marginTop: 4 }}>Experience profile</div>
        </div>

        <nav style={{ padding: "16px 0" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => setActive(n.id)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 28px", border: "none", borderLeft: active === n.id ? `2px solid ${t.accentStrong}` : "2px solid transparent", background: "transparent", color: active === n.id ? t.text : t.textMid, cursor: "pointer", fontSize: 13, fontWeight: active === n.id ? 600 : 400, textAlign: "left", transition: "all 0.15s" }}>
              {n.label}
              <span style={{ fontSize: 10, color: t.textSub }}>{n.count}</span>
            </button>
          ))}
        </nav>

        <div style={{ margin: "0 20px", borderTop: `1px solid ${t.rule}`, paddingTop: 20 }}>
          <button style={{ width: "100%", padding: "10px", border: `1px solid ${t.border2}`, background: "transparent", color: t.textSub, fontSize: 11, letterSpacing: "0.04em", cursor: "pointer" }}>
            ↑ Upload Resume
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "36px 48px" }}>
        {/* Section header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: `2px solid ${t.text}`, marginBottom: 32 }}>
  <h2>
    {nav.find(n => n.id === active)?.label}
  </h2>

  <div style={{ display: "flex", gap: "10px" }}>
    <button className="btn-primary">
      + Add Entry
    </button>

    <button
      onClick={() => setPage("New Session")}
      style={{
        padding: "9px 22px",
        border: "none",
        background: "orange",
        color: "white",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer"
      }}
    >
      New Session →
    </button>
  </div>
</div>

        {/* Work */}
        {active === "work" && (
          <div>
            {work.map((w, i) => (
              <div key={i} className="entry-row" style={{ display: "grid", gridTemplateColumns: "180px 1fr 60px", gap: 32, padding: "24px 12px", borderBottom: `1px solid ${t.rule}`, alignItems: "start", background: "transparent", transition: "background 0.15s" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{w.company}</div>
                  <div style={{ fontSize: 11, color: t.textSub, lineHeight: 1.5 }}>{w.period}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: t.accentStrong, marginBottom: 10 }}>{w.role}</div>
                  {w.bullets.map((b, j) => (
                    <div key={j} style={{ fontSize: 12, color: t.textMid, lineHeight: 1.75, display: "flex", gap: 10, marginBottom: 2 }}>
                      <span style={{ color: t.border2, flexShrink: 0, marginTop: 2 }}>—</span>{b}
                    </div>
                  ))}
                </div>
                <button className="hover-line" style={{ fontSize: 11, background: "none", border: "none", color: t.textSub, cursor: "pointer", paddingTop: 2 }}>Edit</button>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {active === "projects" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {projects.map((p, i) => (
              <div key={i} style={{ paddingBottom: 24, borderBottom: `1px solid ${t.rule}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700 }}>{p.name}</div>
                  <button className="hover-line" style={{ fontSize: 11, background: "none", border: "none", color: t.textSub, cursor: "pointer" }}>Edit</button>
                </div>
                <div style={{ fontSize: 12, color: t.textMid, lineHeight: 1.75, marginBottom: 14 }}>{p.desc}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tech.map((tk, j) => (
                    <span key={j} className="tag-chip" style={{ fontSize: 10, padding: "3px 9px", border: `1px solid ${t.border2}`, color: t.textSub, letterSpacing: "0.04em", cursor: "default" }}>{tk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {active === "skills" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {Object.entries(skills).map(([type, list]) => (
              <div key={type}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: t.accentStrong, marginBottom: 16 }}>{type}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {list.map((s, i) => (
                    <span key={i} className="tag-chip" style={{ padding: "7px 16px", border: `1px solid ${t.border2}`, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, cursor: "default" }}>
                      {s}
                      <span style={{ color: t.textSub, cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</span>
                    </span>
                  ))}
                  <span style={{ padding: "7px 16px", border: `1px dashed ${t.border2}`, fontSize: 12, color: t.textSub, cursor: "pointer" }}>+ Add</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!["work", "projects", "skills"].includes(active) && (
          <div style={{ textAlign: "center", padding: "80px 0", borderBottom: `1px solid ${t.rule}` }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18, color: t.textSub, marginBottom: 12 }}>Nothing here yet.</div>
            <div style={{ fontSize: 12, color: t.textSub }}>Click "Add Entry" to get started.</div>
          </div>
        )}
      </div>
    </div>
  );
}