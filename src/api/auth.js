import api, { tokenStorage } from './axios';

export const authApi = {
    // Inscription d'un nouvel utilisateur
    register: async (username, email, password) => {
        const { data } = await api.post('/auth/register/', {
            username,
            email,
            password
        });
        return data;
    },

    // Connexion : recupere access + refresh token
    login: async (username, password) => {
        const { data } = await api.post('/auth/login/', {
            username,
            password
        });
        tokenStorage.setTokens(data.access, data.refresh);
        return data;
    },

    // Deconnexion 
    logout: () => {
        tokenStorage.clear();
    },

    // Verifie si un token est present
    isAuthenticated: () => {
        return !!tokenStorage.getAccess();
    },
};
