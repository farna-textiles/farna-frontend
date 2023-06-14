/* eslint-disable import/no-extraneous-dependencies */
import React, { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { isAuthenticated, userHasPermission } from '../services/authService';
import PageNotFound from '../pages/PageNotFound';
import ErrorFallback from '../components/ErrorFallback';

const Fallback = <div>Loading...</div>; // Show a loader during lazy loading

interface AuthRouteProps {
  path: string;
  children: ReactNode;
}

const AuthRoute: React.FC<AuthRouteProps> = ({ path, children }) => {
  return isAuthenticated() && userHasPermission(path) ? (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={Fallback}>{children}</Suspense>
    </ErrorBoundary>
  ) : (
    <PageNotFound />
  );
};

export default AuthRoute;
