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

    // Auto-logout Logic
    React.useEffect(() => {
        if (!currentUser) return;

        const TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
        let activityTimer;

        const resetTimer = () => {
            if (activityTimer) clearTimeout(activityTimer);
            activityTimer = setTimeout(() => {
                // console.log("User inactive for 10 minutes, logging out...");
                logout();
            }, TIMEOUT_MS);
        };

        // Initial start
        resetTimer();

        // Listeners
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        return () => {
            if (activityTimer) clearTimeout(activityTimer);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [currentUser]);

    const refreshUser = async () => {
        try {
            // Get latest user data
            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${currentUser?.token || JSON.parse(localStorage.getItem('user'))?.token}`
                }
            });
            if (response.ok) {
                const refreshedUser = await response.json();
                // Ensure token is preserved
                const token = currentUser?.token || JSON.parse(localStorage.getItem('user'))?.token;
                const updatedUser = { ...refreshedUser, token };

                // Update State and Local Storage
                setCurrentUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Persist
                return updatedUser;
            }
        } catch (error) {
            console.error("Failed to refresh user:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, register, loading, refreshUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
