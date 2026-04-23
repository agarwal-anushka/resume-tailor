import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const signup = (data) => api.post("/auth/signup", data);
export const login = (data) => api.post("/auth/login", data);

// Vault
export const uploadResume = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/parser/upload", formData);
};
export const getProjects = () => api.get("/vault/projects");
export const getEducation = () => api.get("/vault/education");
export const getWorkExperience = () => api.get("/vault/work");
export const getSkills = () => api.get("/vault/skills");

// Sessions
export const createSession = (name) => api.post("/jd/sessions", { name });
export const getSessions = () => api.get("/jd/sessions");
export const getSessionSummary = (id) => api.get(`/jd/sessions/${id}/summary`);
export const addJD = (sessionId, data) => api.post(`/jd/sessions/${sessionId}/jds`, data);

// Tailoring
export const tailorSession = (sessionId) => api.post(`/tailor/sessions/${sessionId}`);
export const getResults = (sessionId) => api.get(`/tailor/sessions/${sessionId}/results`);

// Output
export const downloadResume = (tailoredResumeId) =>
  api.get(`/output/download/${tailoredResumeId}`, { responseType: "blob" });
export const downloadAll = (sessionId) =>
  api.get(`/output/download-all/${sessionId}`, { responseType: "blob" });

export default api;