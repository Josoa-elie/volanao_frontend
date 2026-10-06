import api from './axios'

export const categoriesApi = {
    list: async (month) => {
        const params = month ? {month} : {};
        const { data } = await api.get('/categories/', { params });
        return data
    },

    create: async (payload) => {
        const { data } = await api.post('/categories/', payload);
        return data
    },

    update: async(id, payload) => {
        const { data } = await api.patch(`/categories/${id}/`,payload)
        return data
    },

    delete: async(id) => {
        await api.delete(`/categories/${id}/`);
    },
    
};