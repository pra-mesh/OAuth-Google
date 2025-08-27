import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { PageLoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Login page component
 */
export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/todos';

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}