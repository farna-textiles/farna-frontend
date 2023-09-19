/* eslint-disable react/no-array-index-key */
import React, { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import CurrencyFilter from '../../components/filters/CurrencyFilter';
import DashboardCards from './DashboardCards';
import BarChart from '../../components/charts/BarChart';
import DoughnutChart from '../../components/charts/DoughnutChart';
import LineChart from '../../components/charts/LineChart';
import DummyDashboardCards from './DummyDashboardCards';
import AverageBarChart from '../../components/charts/AverageBarChart';

interface ErrorFallbackProps {
  error: Error;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 py-2 px-4">
      <p className="text-red-700">{error.message}</p>
    </div>
  );
};

const LoadingChartPlaceholder: React.FC<{ colSpan: string }> = ({
  colSpan,
}) => {
  return (
    <div
      className={`bg-white rounded-md shadow-lg p-4 animate-pulse col-span-${colSpan}`}
    >
      <div className="flex items-center justify-between border-b border-gray-300">
        <h4 className="text-lg font-semibold text-gray-600">
          Loading Chart...
        </h4>
        <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse" />
      </div>
      <div className="h-72 bg-gray-300 rounded-md mt-4" />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<number>(1);
  const [selectedGraphFilter, setSelectedGraphFilter] = useState<
    'orders' | 'earnings'
  >('orders');

  const handleCurrencyChange = (newCurrency: number) => {
    setSelectedCurrency(newCurrency);
  };

  const handleGraphFilterChange = (newFilter: 'orders' | 'earnings') => {
    setSelectedGraphFilter(newFilter);
  };

  return (
    <main className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-4 h-full">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Dashboard
          </h2>
          <CurrencyFilter
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<DummyDashboardCards />}>
            <DashboardCards currency={+selectedCurrency} />
          </Suspense>
        </ErrorBoundary>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              Graphical Insights
            </h3>
            <select
              className="p-2 rounded-md border-2 border-gray-300 dark:border-gray-700 text-sm bg-gray-100 dark:bg-gray-800"
              value={selectedGraphFilter}
              onChange={(e) =>
                handleGraphFilterChange(e.target.value as 'orders' | 'earnings')
              }
            >
              <option value="orders">Orders</option>
              <option value="earnings">Earnings</option>
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            {[
              { ChartComponent: BarChart, colSpan: '2' },
              { ChartComponent: DoughnutChart, colSpan: '1' },
              { ChartComponent: AverageBarChart, colSpan: '1' },
              { ChartComponent: LineChart, colSpan: '2' },
            ].map(({ ChartComponent, colSpan }, index) => (
              <ErrorBoundary key={index} FallbackComponent={ErrorFallback}>
                <Suspense
                  fallback={<LoadingChartPlaceholder colSpan={colSpan} />}
                >
                  <ChartComponent
                    currency={+selectedCurrency}
                    dataFilter={selectedGraphFilter}
                  />
                </Suspense>
              </ErrorBoundary>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
