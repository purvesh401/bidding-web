/**
 * @file ProtectedRoute.jsx
 * @description Wrapper component protecting routes that require authentication. Optionally
 * restricts access to seller roles.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { useAuthContext } from '../hooks/useAuth.js';

/**
 * @component ProtectedRoute
 * @param {{ children: React.ReactNode, requireSeller?: boolean }} props - Component props.
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ children, requireSeller = false }) => {
  const { authUser, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">Loading authentication status...</span>
        </Spinner>
      </div>
    );
  }

  if (!authUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requireSeller && !['seller', 'both'].includes(authUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
