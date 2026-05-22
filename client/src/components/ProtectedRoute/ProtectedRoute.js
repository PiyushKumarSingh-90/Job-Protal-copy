// Protected route component for role-based access
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (role && !hasRole(role)) {
    return (
      <div className="container">
        <div className="alert alert-error" style={{ marginTop: '2rem' }}>
          <h3>Access Denied</h3>
          <p>You don't have permission to access this page.</p>
          <p>Required role: <strong>{role}</strong></p>
          <p>Your role: <strong>{user?.role}</strong></p>
        </div>
      </div>
    );
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
