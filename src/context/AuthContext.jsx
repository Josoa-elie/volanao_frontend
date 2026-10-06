import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../api/auth' 

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verifie si un token existe encore au demarrage
    useEffect(() => {
        const checkAuth = async () => {
            if (authApi.isAuthenticated()) {
                try {
                    const token = localStorage.getItem('access_token');
                    if (token) {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        const storedUsername = localStorage.getItem('username');
                        setUser({
                            id: payload.user_id,
                            username: storedUsername || 'Utilisateur',
                            name: storedUsername || 'Utilisateur'
                        });
                    }
                } catch {
                    authApi.logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    const login = async (username, password) => {
        await authApi.login(username, password);
        const token = localStorage.getItem('access_token');
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('username', username);
        setUser({
            id: payload.user_id,
            username,
            name: username
        });
    };

    const register = async (username, email, password) => {
        await authApi.register(username, email, password);
        // Auto-login après inscription
        await login(username, password);
    };

    const logout = () => {
        authApi.logout();
        localStorage.removeItem('username');
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit etre utiliser dans un AuthProvider');
    }
    return context
}
