import axios from "axios";

/**
 * =========================================================
 * CONFIG
 * =========================================================
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * =========================================================
 * AXIOS INSTANCE (NO COOKIE, NO CSRF)
 * =========================================================
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // ⛔ PENTING: jangan kirim cookie
});

/**
 * =========================================================
 * REQUEST INTERCEPTOR (Bearer Token)
 * =========================================================
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * =========================================================
 * RESPONSE INTERCEPTOR
 * =========================================================
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "❌ API Error:",
      error.config?.url,
      error.response?.status,
      error.response?.data
    );

    const message =
      error.response?.data?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new Error(message));
  }
);

/**
 * =========================================================
 * AUTH API
 * =========================================================
 */
export const authAPI = {
  async login(email, password) {
    const res = await api.post("/api/v1/auth/login", { email, password });

    // asumsi backend return { token: "xxxx" }
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  },

  async me() {
    const res = await api.get("/api/v1/me");
    return res.data;
  },

  logout() {
    localStorage.removeItem("token");
  },
};

/**
 * =========================================================
 * CONFIG ITEMS API
 * =========================================================
 */
export const configItemsAPI = {
  async getById(id) {
    const res = await api.get(`/api/v1/config-items/${id}`);
    return res.data;
  },

  async getAll(params = {}) {
    const res = await api.get("/api/v1/config-items", { params });
    return res.data;
  },

  async create(data) {
    const res = await api.post("/api/v1/config-items", data);
    return res.data;
  },

  async update(id, data) {
    const res = await api.put(`/api/v1/config-items/${id}`, data);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/api/v1/config-items/${id}`);
    return res.data;
  },
};

/**
 * =========================================================
 * RFC API
 * =========================================================
 */
export const rfcAPI = {
  async getAll() {
    const res = await api.get("/api/v1/rfc");
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/api/v1/rfc/${id}/detail`);
    return res.data;
  },

  async set(id, payload) {
    const res = await api.post(`/api/v1/rfc/${id}/set`, payload);
    return res.data;
  },

  async approve(id, decision, reason = null) {
    const res = await api.post(`/api/v1/rfc/${id}/approve`, {
      decision,
      reason,
    });
    return res.data;
  },

  async forward(id, payload) {
    const res = await api.post(`/api/v1/rfc/${id}/forward`, payload);
    return res.data;
  },
};

export const rfcApprovalAPI = {
  async getAll() {
    const res = await api.get("/api/v1/rfc/approvals");
    return res.data;
  }
};

export default api;
