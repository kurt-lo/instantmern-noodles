import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminPrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // For popping out the privateroute -> element

    const isLoggedIn = async () => {
        const token = localStorage.getItem('authAdminToken');
        
        if (!token) {
             console.log('no token')
            return false;
        }

        try {
            const response = await fetch('/api/admin/profile', {
                method: 'GET',
                headers: {
                    // Authorization: `Bearer ${token}`,
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // User is authenticated
                 console.log('token get')
                return true;
            } else {
                // Token is invalid or expired
                 console.log('token invalid or expired')
                 console.log('Admin Token:', token);
                return false;
            }
        } catch (error) {
            console.error('Error while checking authentication:', error);
            return false;
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            const authenticated = await isLoggedIn();
            setIsAuthenticated(authenticated);
            setIsLoading(false);
        };

        checkAuthentication();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
      }

      return isAuthenticated ? <Outlet /> : <Navigate to='admin/login' />;
}

export default AdminPrivateRoute