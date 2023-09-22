/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';
import { useDashboardDmographic } from '../../hooks/useDashboard';
import { DashboardDataFilter } from '../../interfaces';

type DoughnutChartProps = {
  currency: number;
  dataFilter?: DashboardDataFilter;
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  currency,
  dataFilter = 'orders',
}) => {
  const [isDoughnutChartOn, setDoughnutChartOn] = useState(false);
  const { data } = useDashboardDmographic(
    dataFilter,
    isDoughnutChartOn ? 'city' : 'country',
    currency
  );

  const option = {
    title: {
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: _.capitalize(dataFilter),
        type: 'pie',
        radius: ['50%', '70%'],
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  const handleCountryClick = () => {
    setDoughnutChartOn(false);
  };

  const handleCityClick = () => {
    setDoughnutChartOn(true);
  };

  return (
    <div className="col-span-2 bg-gray-100 xl:col-span-1 rounded-md shadow-lg dark:bg-gray-900 hover:bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Demographics
        </h4>
        <div className="flex items-center">
          <button
            type="button"
            className={`text-gray-500 pr-2 focus:outline-none ${
              !isDoughnutChartOn ? 'font-semibold' : ''
            }`}
            onClick={handleCountryClick}
          >
            Country
          </button>
          <button
            type="button"
            className={`text-gray-500 pl-2 focus:outline-none ${
              isDoughnutChartOn ? 'font-semibold' : ''
            }`}
            onClick={handleCityClick}
          >
            City
          </button>
        </div>
      </div>
      <div className="p-4">
        <ReactEcharts option={option} style={{ height: '300px' }} />
      </div>
    </div>
  );
};

DoughnutChart.defaultProps = {
  dataFilter: 'orders',
};

export default DoughnutChart;
