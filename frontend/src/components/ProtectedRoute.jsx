import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks';
import { appPaths } from '../routes';

const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  return auth.user ? children : <Navigate to={appPaths.loginPagePath} />;
};

export default ProtectedRoute;
