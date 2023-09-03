// Dashboard.js
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardCards from './DashboardCards';

interface ErrorFallbackProps {
  error: Error;
}
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <main className="bg-slate-200">
      <div className="flex items-center justify-between px-4 py-4 border-b lg:py-6 dark:border-primary-darker">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
      </div>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<div>Loading...</div>}>
          <DashboardCards />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default Dashboard;
