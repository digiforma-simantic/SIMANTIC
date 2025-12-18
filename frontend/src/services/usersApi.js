import api from "./api";

export const usersAPI = {
  async getAll() {
    const res = await api.get("/api/v3/users");
    return res.data.data;
  }
};