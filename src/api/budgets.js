import api from './axios'

export const budgetsApi = {
    list: async (month) => {
        const params = month ? {month} : {};
        const { data } = await api.get('/budgets/', { params });
        return data
    },

    create: async (payload) => {
        const { data } = await api.post('/budgets/', payload);
        return data
    },

    update: async(id, payload) => {
        const { data } = await api.patch(`/budgets/${id}/`,payload)
        return data
    },

    delete: async(id) => {
        await api.delete(`/budgets/${id}/`);
    },
    
};