/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

const LoadingCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 animate-pulse">
      <div className="w-20 h-1 bg-gray-300 dark:bg-gray-600 mb-4" />
      <div className="w-32 h-1 bg-gray-300 dark:bg-gray-600 mb-4" />
      <div className="w-16 h-1 bg-gray-300 dark:bg-gray-600" />
    </div>
  );
};

const DummyDashboardCards: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 col-span-full my-3">
      <div className="flex justify-end items-center mb-4 border-b pb-2 w-full">
        <label
          htmlFor="timeRange"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2"
        >
          Time Range:
        </label>
        <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 gap-8 mt-4 lg:grid-cols-2 xl:grid-cols-4">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    </div>
  );
};

export default DummyDashboardCards;
