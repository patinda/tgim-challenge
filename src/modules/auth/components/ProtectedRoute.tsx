import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Pour la démo, on considère que l'utilisateur a tous les rôles
  // Dans une vraie app, vous vérifieriez user.app_metadata.role ou similar
  if (requiredRole && requiredRole.length > 0) {
    // Mock: on considère l'utilisateur comme admin pour la démo
    const userRole = 'admin';
    if (!requiredRole.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}
