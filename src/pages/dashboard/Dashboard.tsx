import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardCards from './DashboardCards';
import BarChart from '../../components/charts/BarChart';
import DoughnutChart from '../../components/charts/DoughnutChart';
import LineChart from '../../components/charts/LineChart';
import DummyDashboardCards from './DummyDashboardCards';
import AverageBarChart from '../../components/charts/AverageBarChart';
import CurrencyFilter from '../../components/filters/CurrencyFilter';

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

const LoadingBarChart: React.FC = () => {
  return (
    <div className="col-span-2 bg-white rounded-md dark:bg-darker shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-600 dark:text-light">
          Loading Chart...
        </h4>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-full w-8 h-8" />
      </div>
      <div className="p-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md h-52" />
      </div>
    </div>
  );
};

const LoadingDoughnutChart: React.FC = () => {
  return (
    <div className="col-span-1 bg-white rounded-md dark:bg-darker shadow-lg">
      <div className="p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Loading Doughnut Chart...
        </h4>
      </div>
      <div className="p-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md h-52" />
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<number>(1);
  const handleCurrencyChange = (newCurrency: number) => {
    setSelectedCurrency(newCurrency);
  };
  return (
    <main className="bg-slate-200">
      <div className="w-full bg-slate-300 dark:bg-gray-900 rounded-lg shadow-lg p-4 col-span-full">
        <div className="flex justify-end w-full">
          <CurrencyFilter
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>
        <div className="grid grid-cols-1 p-4 space-y-8 lg:gap-8 lg:space-y-0 lg:grid-cols-3">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<DummyDashboardCards />}>
              <DashboardCards currency={+selectedCurrency} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingBarChart />}>
              <BarChart currency={+selectedCurrency} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingDoughnutChart />}>
              <DoughnutChart currency={+selectedCurrency} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingDoughnutChart />}>
              <AverageBarChart currency={+selectedCurrency} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<LoadingBarChart />}>
              <LineChart currency={+selectedCurrency} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
