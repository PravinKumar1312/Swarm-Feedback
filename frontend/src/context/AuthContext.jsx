import React, { createContext, useState, useContext } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const user = AuthService.getCurrentUser();
        return user || undefined;
    });
    const [loading] = useState(false);

    const login = async (username, password) => {
        const user = await AuthService.login(username, password);
        setCurrentUser(user);
        return user;
    };

    const logout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
    };

    const register = async (username, email, password, roles) => {
        return AuthService.register(username, email, password, roles);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
