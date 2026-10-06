import api from './axios'

export const expensesApi = {
    list: async (filters = {}) => {
        const { data } = await api.get('/expenses/', {params: filters});
        return data;
    },

    create: async (payload) => {
        const { data } = await api.post('/expenses/', payload);
        return data
    },

    update: async (id, payload) => {
        const { data } = await api.patch(`/expenses/${id}/`,payload);
        return data
    },

    delete: async (id) => {
        await api.delete(`/expenses/${id}/`);
    },
};