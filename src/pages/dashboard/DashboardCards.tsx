/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, ReactElement } from 'react';
import Card from '../../components/elements/Card';
import useDashboardCards from '../../hooks/useDashboard';
import UpArrowIcon from '../../lib/icons/UpArrowIcon';
import DownArrowIcon from '../../lib/icons/DownArrowIcon';
import HorizontalLineIcon from '../../lib/icons/HorizontalLineIcon';

const DashboardCards: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>(
    'month'
  );
  const { data } = useDashboardCards(timeRange);
  const [growthType, setGrowthType] = useState<string>('Sales Growth');
  const [growthValue, setGrowthValue] = useState<string>(
    data.growth.salesGrowth
  );
  const [valueLabel, setValueLabel] = useState<string>('High');
  const [icon, setIcon] = useState<ReactElement | null>(null);

  useEffect(() => {
    const updateValues = () => {
      const numericGrowth = parseFloat(growthValue);
      if (numericGrowth > 0) {
        setValueLabel('High');
        setIcon(
          <UpArrowIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" />
        );
      } else if (numericGrowth < 0) {
        setValueLabel('Low');
        setIcon(
          <DownArrowIcon className="w-12 h-12 text-red-300 dark:text-primary-dark" />
        );
      } else {
        setValueLabel('Neutral');
        setIcon(
          <HorizontalLineIcon className="w-12 h-12 text-gray-300 dark:text-primary-dark" />
        );
      }
    };

    const timer = setInterval(() => {
      if (growthType === 'Sales Growth') {
        setGrowthType('Order Growth');
        setGrowthValue(data.growth.orderGrowth);
      } else {
        setGrowthType('Sales Growth');
        setGrowthValue(data.growth.salesGrowth);
      }
      updateValues();
    }, 5000);

    updateValues();

    return () => clearInterval(timer);
  }, [growthType, growthValue, data]);

  useEffect(() => {
    if (data) {
      setGrowthType('Sales Growth');
      setGrowthValue(data.growth.salesGrowth);
    }
  }, [timeRange, data]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4">
      <div className="flex justify-end items-center mb-4 border-b pb-2">
        <label
          htmlFor="timeRange"
          className="text-sm font-medium text-gray-600 dark:text-gray-300 mr-2"
        >
          Time Range:
        </label>
        <select
          id="timeRange"
          onChange={(e) =>
            setTimeRange(e.target.value as 'week' | 'month' | 'year')
          }
          value={timeRange}
          className="p-2 rounded-md border-2 border-gray-300 dark:border-gray-700 text-sm"
        >
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-8 mt-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card
          title="Amount"
          value={data.earnings.total}
          percentage={data.earnings.percentageChange}
          icon={
            <svg
              className="w-12 h-12 text-gray-300 dark:text-primary-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <Card
          title="Customers"
          value={data.customers.total}
          percentage={data.customers.percentageChange}
          icon={
            <svg
              className="w-12 h-12 text-gray-300 dark:text-primary-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />
        <Card
          title="Orders"
          value={data.orders.total}
          percentage={data.orders.percentageChange}
          icon={
            <svg
              className="w-12 h-12 text-gray-300 dark:text-primary-dark"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          }
        />
        <Card
          title={growthType}
          value={valueLabel}
          percentage={growthValue}
          // eslint-disable-next-line react/jsx-no-useless-fragment
          icon={icon || <></>}
        />
      </div>
    </div>
  );
};

export default DashboardCards;
