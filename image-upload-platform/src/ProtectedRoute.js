import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, requiredRole }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('role');

    if (!isLoggedIn) {
        // Redirect to home or login if not logged in
        return <Navigate to="/" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // Redirect if the role does not match the required role
        return <Navigate to="/" />;
    }

    return element;
};

export default ProtectedRoute;
