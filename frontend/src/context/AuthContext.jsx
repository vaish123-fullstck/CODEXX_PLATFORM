import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthToken(token);
            try {
                const response = await axios.get('http://localhost:5000/api/auth/me');
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setAuthToken(token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null);
        setUser(null);
    };

    // ✅ NEW: Function to refetch user data
    const updateUser = async () => {
        await loadUser();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
