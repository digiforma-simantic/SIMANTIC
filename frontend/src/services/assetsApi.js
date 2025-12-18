import axios from "axios";

const API_BASE_URL = "https://api.siprima.digitaltech.my.id/";
// const API_BASE_URL = "http://127.0.0.1:8001";


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
    const response = await api.get("/api/assets", {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  async getById(id) {
    const response = await api.get(`/api/assets/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  },

  async getByKodeBmd(kodeBmd) {
    const response = await api.get(`/api/assets/bykodebmd/${kodeBmd}`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  }
};
