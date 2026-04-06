import React, { createContext, useContext, useEffect, useState } from 'react';
import { saveToken, getToken, clearToken } from '../services/storage';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const token = await getToken();
            if (token) {
                try {
                    const data = await authService.getProfile();
                    setUser(data.user ?? data);
                } catch {
                    await clearToken();
                }
            }
            setLoading(false);
        })();
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        await saveToken(data.token);
        setUser(data.user);
    };

    const register = async (d) => authService.register(d);

    const setVerifiedUser = async (token, u) => {
        await saveToken(token);
        setUser(u);
    };

    const logout = async () => {
        await clearToken();
        setUser(null);
    };

    const refreshUser = async () => {
        const data = await authService.getProfile();
        setUser(data.user ?? data);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                login,
                register,
                setVerifiedUser,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

export const getInitials = (u) => {
    if (!u) return '?';
    const f = u.first_name?.[0] ?? '';
    const l = u.last_name?.[0] ?? '';
    return (f + l).toUpperCase() || u.email?.[0]?.toUpperCase() || '?';
};
