import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStores } from '../stores/useStores';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authStore } = useStores();

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;