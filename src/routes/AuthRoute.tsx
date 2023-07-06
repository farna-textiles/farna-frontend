import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate } from 'react-router';
import { isAuthenticated, userHasPermission } from '../services/authService';
import PageNotFound from '../pages/PageNotFound';
import ErrorFallback from '../components/ErrorFallback';
import { AuthRouteProps } from '../interfaces';
import { notifyError } from '../lib/utils';

const Fallback = <div>Loading...</div>; // Show a loader during lazy loading

const AuthRoute: React.FC<AuthRouteProps> = ({
  path,
  children,
  redirect = false,
}) => {
  if (isAuthenticated() && userHasPermission(path)) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={Fallback}>{children}</Suspense>
      </ErrorBoundary>
    );
  }
  if (redirect) {
    notifyError('Login required');
    return <Navigate to="/signin" replace />;
  }
  return <PageNotFound />;
};

export default AuthRoute;
