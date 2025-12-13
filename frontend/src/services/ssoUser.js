import axios from "axios";

const API_BASE_URL = "https://api.bispro.digitaltech.my.id";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sso_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const ssoUserApi = {
  getById: (id) => api.get(`/api/v2/auth/user/${id}`), // axios response
};
