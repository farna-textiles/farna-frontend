/* eslint-disable import/no-extraneous-dependencies */
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '../components/ErrorFallback';

const Fallback = <div>Loading...</div>; // Show a loader during lazy loading

interface ErrorBoundaryRouteProps {
  component: React.ReactNode;
}

const ErrorBoundaryRoute: React.FC<ErrorBoundaryRouteProps> = ({
  component,
}) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={Fallback}>{component}</Suspense>
    </ErrorBoundary>
  );
};

export default ErrorBoundaryRoute;
