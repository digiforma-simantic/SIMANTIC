import api from "./api";

export const configurationItemsAPI = {
    async create(payload) {
        const res = await api.post("/api/v3/configuration-items", payload);
        return res.data;
    },

    async getAll() {
        const res = await api.get("/api/v3/configuration-items");
        return res.data;
    },

    async getByKodeBmd(kodBmd) {
        const res = await api.get(
            `/api/v3/configuration-items/kode-bmd/${kodBmd}`
        );
        return res.data;
    },

    async getByUserId(userId) {
        const res = await api.get(
            `/api/v3/configuration-items/by-user/${userId}`
        );
        return res.data;
    }

    getByAssetId(assetId) {
        return api.get(`/api/v3/configuration-items/by-asset/${assetId}`);
    },


    async getById(id) {
        const res = await api.get(`/api/v3/configuration-items/${id}`);
        return res.data;
    },

    async update(id, payload) {
        const res = await api.put(`/api/v3/configuration-items/${id}`, payload);
        return res.data;
    },

    async remove(id) {
        const res = await api.delete(`/api/v3/configuration-items/${id}`);
        return res.data;
    },
};
