import api from './axios'

export const dashboardApi = {
    get: async (month) => {
        const { data } = await api.get('/dashboard/', { params: { month } })
        return data
    },
    
};
