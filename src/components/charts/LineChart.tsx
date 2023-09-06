import React from 'react';
import ReactEcharts from 'echarts-for-react';

const LineChart: React.FC = () => {
  const option = {
    title: {
      text: 'Earnings Comparison Over Multiple Years',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['Year 1', 'Year 2', 'Year 3'], // Add more years as needed
      top: 30,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yAxis: {
      type: 'value',
      name: 'Earnings',
    },
    series: [
      {
        name: 'Year 1',
        type: 'line',
        data: [
          1000, 1200, 1500, 1300, 1400, 1600, 1700, 1800, 1900, 2000, 2100,
          2200,
        ],
      },
      {
        name: 'Year 2',
        type: 'line',
        data: [
          1100, 1300, 1600, 1400, 1500, 1700, 1800, 1900, 2000, 2100, 2200,
          2300,
        ],
      },
      {
        name: 'Year 3',
        type: 'line',
        data: [
          1200, 1400, 1700, 1500, 1600, 1800, 1900, 2000, 2100, 2200, 2300,
          2400,
        ],
      },
      // Add more series for additional years
    ],
  };

  return (
    <div className="col-span-2 bg-white rounded-md dark:bg-darker">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Revenue Comparison Over Multiple Years
        </h4>
      </div>
      <div className="relative p-4 h-72">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

export default LineChart;
