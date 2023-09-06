import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate } from 'react-router';
import { Loader } from '@mantine/core';
import { isAuthenticated, userHasPermission } from '../services/authService';
import PageNotFound from '../pages/PageNotFound';
import ErrorFallback from '../components/ErrorFallback';
import { AuthRouteProps } from '../interfaces';
import { notifyError } from '../lib/utils';

const Fallback = (
  <div className="flex h-screen items-center justify-center">
    <Loader size={75} />
  </div>
);

const AuthRoute: React.FC<AuthRouteProps> = ({
  path,
  children,
  redirect = false,
  useErrorBoundaryAndSuspense = true,
}) => {
  if (isAuthenticated() && userHasPermission(path)) {
    if (useErrorBoundaryAndSuspense) {
      return (
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={Fallback}>{children}</Suspense>
        </ErrorBoundary>
      );
    }
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
  if (redirect) {
    notifyError('Login required');
    return <Navigate to="/signin" replace />;
  }
  return <PageNotFound />;
};

export default AuthRoute;
