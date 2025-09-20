import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allow }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" />;
  if (allow && !allow.includes(user.role)) return <Navigate to="/" />;
  return <Outlet />;
}
