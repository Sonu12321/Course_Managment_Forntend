import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If a specific role is required, check if user has that role
  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
};

export default PrivateRoute;