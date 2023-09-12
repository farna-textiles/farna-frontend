import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { useDashboardDmographic } from '../../hooks/useDashboard';
import ToggleSwitch from '../elements/ToggleSwitch';

const DoughnutChart: React.FC = () => {
  const sortBy = 'orders';
  const [isDoughnutChartOn, setDoughnutChartOn] = useState(false);
  const { data } = useDashboardDmographic(
    sortBy,
    isDoughnutChartOn ? 'city' : 'country'
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
        name: 'Orders',
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

  return (
    <div className="bg-white rounded-md dark:bg-darker">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Order Statistics by {isDoughnutChartOn ? 'City' : 'Country'}
        </h4>
        <ToggleSwitch
          isOn={isDoughnutChartOn}
          onToggle={() => setDoughnutChartOn(!isDoughnutChartOn)}
        />
      </div>
      <div className="relative p-4 h-72">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

export default DoughnutChart;
