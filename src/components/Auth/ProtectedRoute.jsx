import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginPage from './LoginPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // While checking auth (e.g., restoring session), show a spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-primary-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Render the protected content
  return children;
};

export default ProtectedRoute;
