import { useState, useEffect } from "react";
import { getWorkExperience, getProjects, getSkills, getEducation, uploadResume } from "../api";

export default function Vault({ t, setPage }) {
  const [active, setActive] = useState("work");
  const [work, setWork] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState({ Technical: [], Soft: [] });
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [workRes, projRes, skillRes, eduRes] = await Promise.all([
        getWorkExperience(),
        getProjects(),
        getSkills(),
        getEducation(),
      ]);
      setWork(workRes.data);
      setProjects(projRes.data);
      setEducation(eduRes.data);

      // Group skills by type
      const technical = skillRes.data.filter(s => s.skill_type === "technical").map(s => s.skill_name);
      const soft = skillRes.data.filter(s => s.skill_type === "soft").map(s => s.skill_name);
      setSkills({ Technical: technical, Soft: soft });
    } catch (err) {
      console.error("Failed to fetch vault data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg("");
    try {
      await uploadResume(file);
      setUploadMsg("Resume parsed successfully!");
      fetchAll();
    } catch (err) {
      setUploadMsg("Failed to parse resume. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const nav = [
    { id: "work", label: "Work Experience", count: work.length },
    { id: "projects", label: "Projects", count: projects.length },
    { id: "skills", label: "Skills", count: skills.Technical.length + skills.Soft.length },
    { id: "education", label: "Education", count: education.length },
  ];

  return (
    <div className="page-enter" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 44px)" }}>

      {/* Sidebar */}
      <div style={{ borderRight: `1px solid ${t.rule}` }}>
        <div style={{ padding: "28px 28px 20px", borderBottom: `1px solid ${t.rule}` }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}>Your Vault</div>
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
          <label style={{ width: "100%", display: "block", padding: "10px", border: `1px solid ${t.border2}`, background: "transparent", color: t.textSub, fontSize: 11, letterSpacing: "0.04em", cursor: "pointer", textAlign: "center" }}>
            {uploading ? "Parsing..." : "↑ Upload Resume"}
            <input type="file" accept=".pdf,.docx" onChange={handleUpload} style={{ display: "none" }} />
          </label>
          {uploadMsg && <div style={{ fontSize: 11, marginTop: 8, color: uploadMsg.includes("success") ? t.success : t.danger, textAlign: "center" }}>{uploadMsg}</div>}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: "36px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: `2px solid ${t.text}`, marginBottom: 32 }}>
          <h2>{nav.find(n => n.id === active)?.label}</h2>
          <button onClick={() => setPage("New Session")} style={{ padding: "9px 22px", border: "none", background: t.accentStrong, color: t.bg, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            New Session →
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: t.textSub, fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>Loading vault...</div>
        ) : (
          <>
            {/* Work */}
            {active === "work" && (
              <div>
                {work.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 0", color: t.textSub, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>No work experience yet. Upload your resume to get started.</div>
                ) : work.map((w, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 32, padding: "24px 12px", borderBottom: `1px solid ${t.rule}`, alignItems: "start" }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{w.company}</div>
                      <div style={{ fontSize: 11, color: t.textSub }}>{w.start_date} – {w.end_date || "Present"}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 14, color: t.accentStrong, marginBottom: 10 }}>{w.role}</div>
                      {(w.responsibilities || []).map((b, j) => (
                        <div key={j} style={{ fontSize: 12, color: t.textMid, lineHeight: 1.75, display: "flex", gap: 10, marginBottom: 2 }}>
                          <span style={{ color: t.border2, flexShrink: 0 }}>—</span>{b}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {active === "projects" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {projects.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 0", color: t.textSub, fontFamily: "'Playfair Display', serif", fontStyle: "italic", gridColumn: "span 2" }}>No projects yet.</div>
                ) : projects.map((p, i) => (
                  <div key={i} style={{ paddingBottom: 24, borderBottom: `1px solid ${t.rule}` }}>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: t.textMid, lineHeight: 1.75, marginBottom: 14 }}>{p.description}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(p.tech_stack || []).map((tk, j) => (
                        <span key={j} style={{ fontSize: 10, padding: "3px 9px", border: `1px solid ${t.border2}`, color: t.textSub, letterSpacing: "0.04em" }}>{tk}</span>
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
                        <span key={i} style={{ padding: "7px 16px", border: `1px solid ${t.border2}`, fontSize: 12, fontWeight: 500 }}>{s}</span>
                      ))}
                      {list.length === 0 && <span style={{ fontSize: 12, color: t.textSub, fontStyle: "italic" }}>No {type.toLowerCase()} skills yet.</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {active === "education" && (
              <div>
                {education.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "80px 0", color: t.textSub, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>No education entries yet.</div>
                ) : education.map((e, i) => (
                  <div key={i} style={{ padding: "24px 12px", borderBottom: `1px solid ${t.rule}` }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{e.institution}</div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 13, color: t.accentStrong, marginBottom: 4 }}>{e.degree} in {e.field}</div>
                    <div style={{ fontSize: 11, color: t.textSub }}>{e.start_year} – {e.end_year || "Present"}</div>
                    {e.gpa && <div style={{ fontSize: 11, color: t.textSub, marginTop: 4 }}>GPA: {e.gpa}</div>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}