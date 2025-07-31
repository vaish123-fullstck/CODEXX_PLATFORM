import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a helper function to set the auth token for all axios requests
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

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
                try {
                    // Fetch user data if a token exists
                    const response = await axios.get('http://localhost:5000/api/auth/me');
                    setUser(response.data.user);
                } catch (error) {
                    // If token is invalid, remove it
                    localStorage.removeItem('token');
                    console.error("Auth Error on load:", error);
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setAuthToken(token); // Set axios header
        setUser(userData);   // Set the user state immediately
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthToken(null); // Remove axios header
        setUser(null);      // Clear the user state
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};