import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import HomePage from '../page/HomePage';

const PrivateRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For popping out the privateroute -> element

  const isLoggedIn = async () => {
    const token = localStorage.getItem('authUserToken');

    if (!token) {
      // console.log('no token')
      return false;
    }

    try {
      // Make a request to the profile endpoint to validate the token
      const response = await fetch('/api/users/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // User is authenticated
        // console.log('token get')
        return true;
      } else {
        // Token is invalid or expired
        // console.log('token invalid or expired')
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

  console.log(isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
