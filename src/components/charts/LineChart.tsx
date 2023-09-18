/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { YearPickerInput } from '@mantine/dates';
import { useCompareYears } from '../../hooks/useDashboard';
import { CompareRangeType } from '../../interfaces';

const LineChart: React.FC<{ currency: number }> = ({ currency }) => {
  const currentDate = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);
  const [value, setValue] = useState<[Date | null, Date | null]>([
    fiveYearsAgo,
    currentDate,
  ]);

  const dataFilter = 'order';

  const { data } = useCompareYears(
    {
      startYear: value[0]?.getFullYear() ?? 2018,
      endYear: value[1]?.getFullYear() ?? 2023,
    },
    dataFilter,
    currency
  ) as { data: CompareRangeType[] };

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
      data: data.map((res: CompareRangeType) => res.name),
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
    series: data,
  };

  return (
    <div className="col-span-2 bg-white rounded-md dark:bg-darker">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Comparison Over Multiple Years
        </h4>
        <YearPickerInput
          type="range"
          placeholder="Pick dates range"
          value={value}
          onChange={setValue}
          maw={400}
        />
      </div>
      <div className="relative p-4 h-72">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

export default LineChart;
