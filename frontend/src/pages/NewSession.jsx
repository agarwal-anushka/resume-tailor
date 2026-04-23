import { useState } from "react";
import { createSession, addJD, tailorSession, getWorkExperience, getProjects } from "../api";

export default function NewSession({ t, setPage }) {
  const [sessionName, setSessionName] = useState("Frontend Roles — April 2026");
  const [jds, setJds] = useState([{ id: 1, title: "", content: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addJdBlock = () => {
    setJds(prev => [...prev, { id: Date.now(), title: "", content: "" }]);
  };

  const removeJd = (id) => {
    setJds(prev => prev.filter(j => j.id !== id));
  };

  const updateJd = (id, field, value) => {
    setJds(prev => prev.map(j => j.id === id ? { ...j, [field]: value } : j));
  };

  const handleGenerate = async () => {
    setError("");
    try {
      const workRes = await getWorkExperience();
      const projRes = await getProjects();
      if (workRes.data.length === 0 && projRes.data.length === 0) {
        setError("Your vault is empty. Please upload your resume in the Vault page first.");
        return;
      }
    } catch (err) {
      setError("Could not verify vault data. Please try again.");
      return;
    }

    // Validate
    const empty = jds.find(j => !j.content.trim());
    if (empty) {
      setError("Please fill in all job descriptions before generating.");
      return;
    }
    if (!sessionName.trim()) {
      setError("Please enter a session name.");
      return;
    }

    setLoading(true);
    try {
      // Step 1 — create session
      const sessionRes = await createSession(sessionName.trim());
      const sessionId = sessionRes.data.id;

      // Step 2 — add all JDs
      console.log("JDs being sent:", jds.map(jd => ({ title: jd.title, contentLength: jd.content.length, content: jd.content.substring(0, 100) })));
      await Promise.all(
        
        jds.map(jd => addJD(sessionId, { title: jd.title || null, content: jd.content }))
      );

      // Step 3 — trigger tailoring
      await tailorSession(sessionId);

      // Step 4 — navigate to session status with session ID
      setPage("Session Status", sessionId);

    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <input
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          style={{ width: "100%", padding: "12px 0", borderTop: "none", borderLeft: "none", borderRight: "none", borderBottom: `1.5px solid ${t.border2}`, background: "transparent", color: t.text, fontSize: 18, fontWeight: 600, letterSpacing: "-0.3px", outline: "none" }}
        />
      </div>

      {/* JD header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: 20, borderBottom: `2px solid ${t.text}`, marginBottom: 32 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700 }}>Job Descriptions</h2>
        <button
          onClick={addJdBlock}
          style={{ padding: "10px 24px", border: `1px solid ${t.border2}`, background: "transparent", color: t.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          + Add JD
        </button>
      </div>

      {/* JD blocks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {jds.map((jd, i) => (
          <div key={jd.id} style={{ border: `1px solid ${t.border2}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: `1px solid ${t.rule}`, background: t.surface }}>
              <input
                placeholder={`Job Description ${["I","II","III","IV","V","VI"][i] || i+1} — optional title`}
                value={jd.title}
                onChange={(e) => updateJd(jd.id, "title", e.target.value)}
                style={{ background: "transparent", border: "none", outline: "none", color: t.textMid, fontSize: 13, fontFamily: "'Playfair Display', serif", fontStyle: "italic", flex: 1 }}
              />
              {jds.length > 1 && (
                <button onClick={() => removeJd(jd.id)} style={{ fontSize: 11, background: "none", border: "none", color: t.danger, cursor: "pointer" }}>Remove</button>
              )}
            </div>
            <textarea
              placeholder="Paste the full job description here..."
              value={jd.content}
              onChange={(e) => updateJd(jd.id, "content", e.target.value)}
              style={{ width: "100%", minHeight: 120, padding: "16px 18px", border: "none", background: "transparent", color: t.textMid, fontSize: 13, lineHeight: 1.75, resize: "vertical", outline: "none", boxSizing: "border-box" }}
            />
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginTop: 16, fontSize: 12, color: t.danger, padding: "10px 14px", border: `1px solid ${t.danger}` }}>
          {error}
        </div>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 32, borderTop: `1px solid ${t.rule}`, marginTop: 32 }}>
        <button
          onClick={() => setPage("Vault")}
          style={{ fontSize: 12, background: "none", border: "none", color: t.textSub, cursor: "pointer", letterSpacing: "0.04em" }}
        >
          ← Back to Vault
        </button>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: "14px 40px", border: "none", background: t.accentStrong, color: t.bg, fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, transition: "all 0.2s" }}
        >
          {loading ? "Generating..." : `Generate ${jds.length} Resume${jds.length !== 1 ? "s" : ""} →`}
        </button>
      </div>
    </div>
  );
}