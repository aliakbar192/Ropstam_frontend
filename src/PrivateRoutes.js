import React from 'react';
import './App.css';
import { Outlet, Navigate } from 'react-router-dom';

import authService from './services/authService';

const PrivateRoutes = () => {
    const token = authService.getJwt();
    console.log(token);
    const isAuthenticated = !!token;

    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
