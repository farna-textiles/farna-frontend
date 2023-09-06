import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const BarChart: React.FC = () => {
  const [selectedYears, setSelectedYears] = useState([]);

  const option = {
    legend: {
      data: ['Year 2022', 'Year 2023'],
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
    series: [
      {
        name: 'Year 2022',
        data: [120, 200, 150, 80, 70, 110, 130, 100, 105, 125, 145, 160],
        type: 'bar',
      },
      {
        name: 'Year 2023',
        data: [100, 180, 160, 90, 65, 105, 115, 95, 110, 135, 155, 170],
        type: 'bar',
      },
    ],
  };

  const handleYearChange = (dates: [Date, Date]) => {
    setSelectedYears(dates);
  };

  return (
    <div className="col-span-2 bg-white rounded-md dark:bg-darker">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Orders Comparison for Two Years
        </h4>
      </div>
      <div className="relative p-4 h-72">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

export default BarChart;
