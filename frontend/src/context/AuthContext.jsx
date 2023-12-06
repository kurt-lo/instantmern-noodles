import React, { createContext, useEffect, useState } from 'react';
import axios from './axiosConfig'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/login', credentials);

            const { token } = response.data;
            localStorage.setItem('authUserToken', token);

            setIsAuthenticated(true);
            setForceUpdate(prev => !prev)
        } catch (error) {
            console.error('Login Failed:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('authUserToken');
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('authUserToken');

        setIsAuthenticated(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthContext, AuthProvider };