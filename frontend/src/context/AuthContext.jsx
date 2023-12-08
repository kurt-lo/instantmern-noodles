import React, { createContext, useEffect, useState } from 'react';
import axios from './axiosConfig'
// import axios from 'axios'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/login', credentials);
            const { token } = response.data;
            localStorage.setItem('authUserToken', token);

            const userDataResponse = await axios.get('/api/users/profile');
            const userData = userDataResponse.data;

            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login Failed:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('authUserToken');
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('authUserToken');

        if (token) {
            const fetchData = async () => {
                try {
                    const response = await axios.get('/api/users/profile');
                    setUser(response.data);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error(error);
                    setIsAuthenticated(false);
                }
            };

            fetchData();
        }
    }, []);

    // console.log('AuthContext - isAuthenticated:', isAuthenticated);
    // console.log('AuthContext - user:', user);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
