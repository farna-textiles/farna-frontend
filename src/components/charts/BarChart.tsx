import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { useCompareTwoYears } from '../../hooks/useDashboard';

const BarChart: React.FC = () => {
  const [selectedYear1, setSelectedYear1] = useState<string>('2022');
  const [selectedYear2, setSelectedYear2] = useState<string>('2023');

  const { data } = useCompareTwoYears({
    year1: selectedYear1,
    year2: selectedYear2,
  });

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({ length: currentYear - 2021 }, (_, index) =>
    (2022 + index).toString()
  );

  const option = {
    legend: {
      data: [`Year ${selectedYear1}`, `Year ${selectedYear2}`],
    },
    xAxis: {
      type: 'category',
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
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any[]) => {
        const year1Data = params[0]?.data as number;
        const year2Data = params[1]?.data as number;

        const tooltipLines: string[] = [];

        if (year1Data) {
          tooltipLines.push(`${params[0]?.seriesName}: ${year1Data}`);
        }
        if (year2Data) {
          tooltipLines.push(`${params[1]?.seriesName}: ${year2Data}`);
        }

        return tooltipLines.join('<br/>');
      },
    },
    series: [
      {
        name: `Year ${selectedYear1}`,
        data: data[selectedYear1],
        type: 'bar',
      },
      {
        name: `Year ${selectedYear2}`,
        data: data[selectedYear2],
        type: 'bar',
      },
    ],
  };

  return (
    <div className="col-span-2 bg-white rounded-md dark:bg-darker">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Orders Comparison for Two Years
        </h4>
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <select
              value={selectedYear1}
              onChange={(e) => setSelectedYear1(e.target.value)}
              className="appearance-none border rounded-md py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring focus:border-primary"
            >
              {yearsList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedYear2}
              onChange={(e) => setSelectedYear2(e.target.value)}
              className="appearance-none border rounded-md py-2 pl-3 pr-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring focus:border-primary"
            >
              {yearsList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="relative p-4 h-72">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

export default BarChart;
