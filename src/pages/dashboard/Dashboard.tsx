// Dashboard.js
import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardCards from './DashboardCards';
import BarChart from '../../components/charts/BarChart';
import DoughnutChart from '../../components/charts/DoughnutChart';
import LineChart from '../../components/charts/LineChart';
import DummyDashboardCards from './DummyDashboardCards';

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
      <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<DummyDashboardCards />}>
            <DashboardCards />
          </Suspense>
        </ErrorBoundary>
        <BarChart />
        <DoughnutChart />
        <div className="col-span-1 bg-white rounded-md dark:bg-darker">
          <div className="p-4 border-b dark:border-primary">
            <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
              Active users right now
            </h4>
          </div>
          <div className="p-4"></div>
        </div>
        <LineChart />
      </div>
    </main>
  );
};

export default Dashboard;
