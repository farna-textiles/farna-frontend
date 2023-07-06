/* eslint-disable import/no-extraneous-dependencies */
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate } from 'react-router';
import ErrorFallback from '../components/ErrorFallback';
import { isAuthenticated } from '../services/authService';
import { ErrorBoundaryRouteProps } from '../interfaces';

const Fallback = <div>Loading...</div>; // Show a loader during lazy loading

const ErrorBoundaryRoute: React.FC<ErrorBoundaryRouteProps> = ({
  component,
}) => {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={Fallback}>{component}</Suspense>
    </ErrorBoundary>
  );
};

export default ErrorBoundaryRoute;
