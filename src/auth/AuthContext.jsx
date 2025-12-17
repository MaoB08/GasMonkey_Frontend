import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Error parsing user data:', err);
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
            }
        }
        setLoading(false);
    }, []);

    // Listen for storage changes (e.g., login in another tab)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'accessToken') {
                if (e.newValue) {
                    const savedUser = localStorage.getItem('user');
                    if (savedUser) {
                        try {
                            setUser(JSON.parse(savedUser));
                            setIsAuthenticated(true);
                        } catch (err) {
                            console.error('Error parsing user data:', err);
                        }
                    }
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = (token, userData) => {
        localStorage.setItem('accessToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const getToken = () => {
        return localStorage.getItem('accessToken');
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        getToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
