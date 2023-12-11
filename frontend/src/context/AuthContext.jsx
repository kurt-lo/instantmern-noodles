import React, { createContext, useEffect, useState } from 'react';
import axios from './axiosConfig'
// import axios from 'axios'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [admin, setAdmin] = useState(null);
    const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);

    //FOR USER
    const login = async (credentials) => {
        try {
            const response = await axios.post('/api/users/login', credentials);
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

    // FOR ADMIN
    const adminLogin = async (credentials) => {
        try {
            const response = await axios.post('/api/admin/login', credentials);
            const { token } = response.data;
            localStorage.setItem('authAdminToken', token);

            const userDataResponse = await axios.get('/api/admin/profile');
            const userData = userDataResponse.data;

            setAdmin(userData);
            setIsAuthenticatedAdmin(true);
        } catch (error) {
            console.error('Login Failed:', error);
        }
    };

    const adminLogout = () => {
        localStorage.removeItem('authAdminToken');
        setAdmin(null);
        setIsAuthenticatedAdmin(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('authUserToken');
        const adminToken = localStorage.getItem('authAdminToken');

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
        //FOR ADMIN
        if (adminToken) {
            const fetchDataAdmin = async () => {
                try {
                    const response = await axios.get('/api/admin/profile');
                    setAdmin(response.data);
                    setIsAuthenticatedAdmin(true);
                } catch (error) {
                    console.error(error);
                    setIsAuthenticatedAdmin(false);
                }
            };

            fetchDataAdmin();
        }
    }, []);

    // console.log('AuthContext - isAuthenticated:', isAuthenticated);
    // console.log('AuthContext - user:', user);
    // console.log('AuthContextAdmin - isAuthenticatedAdmin:', isAuthenticatedAdmin);
    // console.log('AuthContextAdmin - admin:', admin);

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isAuthenticatedAdmin, admin, login, logout, adminLogin, adminLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
