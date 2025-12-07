import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log("API Request:", config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // console.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.config?.url, error.response?.status, error.response?.data);
    const message = error.response?.data?.message || error.message || "Request failed";
    return Promise.reject(new Error(message));
  }
);

/**
 * Configuration Items API
 */
export const configItemsAPI = {
  /**
   * Get single configuration item by ID
   */
  async getById(id) {
    const response = await api.get(`/api/v1/config-items/${id}`);
    return response.data;
  },

  /**
   * Get all configuration items
   */
  async getAll(filters = {}) {
    const response = await api.get("/api/v1/config-items", { params: filters });
    return response.data;
  },

  /**
   * Create new configuration item
   */
  async create(data) {
    const response = await api.post("/api/v1/config-items", data);
    return response.data;
  },

  /**
   * Update configuration (admin form)
   */
  async updateConfiguration(id, data) {
    const response = await api.patch(`/api/v1/config-items/${id}/configuration`, data);
    return response.data;
  },

  /**
   * Update full configuration item
   */
  async update(id, data) {
    const response = await api.put(`/api/v1/config-items/${id}`, data);
    return response.data;
  },

  /**
   * Delete configuration item (soft delete)
   */
  async delete(id) {
    const response = await api.delete(`/api/v1/config-items/${id}`);
    return response.data;
  },
};

/**
 * Asset Import API
 */
export const assetImportAPI = {
  /**
   * Import assets from external API
   */
  async importAssets(token = null) {
    const payload = token ? { token } : {};
    const response = await api.post("/api/v1/import/assets", payload);
    return response.data;
  },

  /**
   * Import dinas from SSO API
   */
  async importDinas() {
    const response = await api.post("/api/v1/import/dinas", {});
    return response.data;
  },

  /**
   * Import users from SSO API
   */
  async importUsers(ssoToken = null) {
    const payload = ssoToken ? { sso_token: ssoToken } : {};
    const response = await api.post("/api/v1/import/users", payload);
    return response.data;
  },
};

/**
 * Auth API
 */
export const authAPI = {
  /**
   * Login
   */
  async login(email, password) {
    const response = await api.post("/api/v1/auth/login", { email, password });
    return response.data;
  },

  /**
   * Get current user
   */
  async me() {
    const response = await api.get("/api/v1/me");
    return response.data;
  },
};

/**
 * RFC API
 */
export const rfcAPI = {
  /**
   * Get pending RFCs for approval
   */
  async getPendingApprovals() {
    const response = await api.get("/api/v1/rfc/pending-approval");
    return response.data;
  },

  /**
   * Get RFC detail by ID
   */
  async getById(id) {
    const response = await api.get(`/api/v1/rfc/${id}`);
    return response.data;
  },

  /**
   * Approve or reject RFC
   */
  async approve(id, decision, reason = null) {
    const response = await api.post(`/api/v1/rfc/${id}/approve`, {
      decision,
      reason,
    });
    return response.data;
  },

  /**
   * Get approval history
   */
  async getHistory() {
    const response = await api.get("/api/v1/rfc/history");
    return response.data;
  },

  /**
   * Get all RFCs (filtered by user)
   */
  async getAll() {
    const response = await api.get("/api/v1/rfc");
    return response.data;
  },

  /**
   * Create new RFC
   */
  async create(data) {
    const response = await api.post("/api/v1/rfc", data);
    return response.data;
  },
};

export default {
  configItemsAPI,
  assetImportAPI,
  authAPI,
  rfcAPI,
};
