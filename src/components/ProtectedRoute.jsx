import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../index.css';

/**
 * ProtectedRoute component
 * @param {ReactNode} children - The component to render if access is allowed
 * @param {Array} roles - Optional array of roles allowed to access this route
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user } = useAuth();
  const location = useLocation();

  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  
  if (roles.length > 0 && !roles.includes(user.role)) {
    
    return <Navigate to="/" replace />;
  }

  
  return children;
}
