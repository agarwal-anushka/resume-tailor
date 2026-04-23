import { useState, useEffect } from "react";
import { getResults, downloadResume, downloadAll } from "../api";

export default function SessionStatus({ t, sessionId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    fetchResults();
  }, [sessionId]);

  const fetchResults = async () => {
    try {
      const res = await getResults(sessionId);
      setJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (tailoredResumeId, title) => {
    setDownloading(tailoredResumeId);
    try {
      const res = await downloadResume(tailoredResumeId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title || "resume"}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = async () => {
    setDownloading("all");
    try {
      const res = await downloadAll(sessionId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tailored_resumes.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download all failed", err);
    } finally {
      setDownloading(null);
    }
  };

  const cfg = {
    done:    { label: "Ready to download", color: "#27AE60" },
    failed:  { label: "Failed",            color: "#C0392B" },
    pending: { label: "Queued",            color: "#6B6A60" },
  };

  const done = jobs.filter(j => j.status === "done").length;
  const pct = jobs.length > 0 ? Math.round((done / jobs.length) * 100) : 0;

  if (!sessionId) {
    return (
      <div style={{ textAlign: "center", padding: "120px 32px", color: t.textSub, fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: 18 }}>
        No active session. Go to New Session to start.
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ maxWidth: 800, margin: "0 auto", padding: "56px 32px" }}>

      {/* Header */}
      <div style={{ paddingBottom: 28, borderBottom: `2px solid ${t.text}`, marginBottom: 40 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: t.textSub, marginBottom: 10 }}>
          Session Results
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 900, letterSpacing: "-0.8px" }}>
            {done} of {jobs.length} Resumes <em style={{ fontStyle: "italic", color: t.accentStrong }}>Ready</em>
          </h1>
          <span style={{ fontSize: 28, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: t.textSub }}>{pct}%</span>
        </div>
        <div style={{ marginTop: 16, height: 3, background: t.border2, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, right: `${100 - pct}%`, background: t.text, transition: "right 0.6s ease" }} />
        </div>
      </div>

      {/* Job rows */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: t.textSub, fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>Loading results...</div>
      ) : (
        <div style={{ marginBottom: 32 }}>
          {jobs.map((j, i) => {
            const s = cfg[j.status] || cfg.pending;
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 32, alignItems: "center", padding: "20px 12px", borderBottom: `1px solid ${t.rule}` }}>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, marginBottom: 3 }}>
                    {j.jd_title || `Job Description ${i + 1}`}
                  </div>
                  <div style={{ fontSize: 12, color: t.textSub }}>JD #{j.jd_id}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: s.color, fontWeight: 500 }}>{s.label}</span>
                </div>
                {j.status === "done" && j.tailored_resume_id ? (
                  <button
                    onClick={() => handleDownload(j.tailored_resume_id, j.jd_title)}
                    disabled={downloading === j.tailored_resume_id}
                    style={{ fontSize: 12, background: "none", border: "none", color: t.text, cursor: "pointer", fontWeight: 600 }}
                  >
                    {downloading === j.tailored_resume_id ? "Downloading..." : "↓ Download"}
                  </button>
                ) : (
                  <div style={{ width: 80 }} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bulk download */}
      {!loading && done === jobs.length && jobs.length > 0 ? (
        <button
          onClick={handleDownloadAll}
          disabled={downloading === "all"}
          style={{ width: "100%", padding: "16px", border: "none", background: t.accentStrong, color: t.bg, fontWeight: 600, fontSize: 12, letterSpacing: "0.06em", cursor: downloading === "all" ? "not-allowed" : "pointer", opacity: downloading === "all" ? 0.7 : 1, transition: "all 0.2s" }}
        >
          {downloading === "all" ? "Preparing ZIP..." : `↓ Download All ${jobs.length} Resumes as ZIP`}
        </button>
      ) : !loading && (
        <div style={{ padding: "16px 24px", border: `1px solid ${t.border2}`, fontSize: 12, color: t.textSub, textAlign: "center", fontStyle: "italic", fontFamily: "'Playfair Display', serif" }}>
          Bulk download available when all resumes are complete.
        </div>
      )}
    </div>
  );
}