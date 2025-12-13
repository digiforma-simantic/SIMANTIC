import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      }
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
});

export const assetsAPI = {
  async getAll() {
    const response = await api.get("/api/v1/assets", {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/api/v1/assets/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
