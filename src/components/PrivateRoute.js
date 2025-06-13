import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If authenticated, render the children (the protected component), otherwise navigate to login
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
