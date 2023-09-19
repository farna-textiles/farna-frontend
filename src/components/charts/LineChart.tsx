/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { YearPickerInput } from '@mantine/dates';
import { useCompareYears } from '../../hooks/useDashboard';
import { CompareRangeType } from '../../interfaces';
import { notifyError } from '../../lib/utils';

type LineChartProps = {
  currency: number;
  dataFilter?: 'orders' | 'earnings';
};

const LineChart: React.FC<LineChartProps> = ({
  currency,
  dataFilter = 'orders',
}) => {
  const currentDate = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);
  const [value, setValue] = useState<[Date | null, Date | null]>([
    fiveYearsAgo,
    currentDate,
  ]);

  const { data } = useCompareYears(
    {
      startYear: value[0]?.getFullYear(),
      endYear: value[1]?.getFullYear(),
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
    <div className="col-span-2 bg-gray-100 rounded-md shadow-lg dark:bg-gray-900 hover:bg-gray-50">
      <div className="flex items-center justify-between p-4 border-b dark:border-primary">
        <h4 className="text-lg font-semibold text-gray-500 dark:text-light">
          Comparison Over Multiple Years
        </h4>
        <YearPickerInput
          type="range"
          placeholder="Pick dates range"
          value={value}
          onChange={(dateRange) => {
            const [start, end] = dateRange;
            if (start && !end) setValue([start, null]);
            if (start && end) {
              const futureDate = new Date(start);
              futureDate.setFullYear(start.getFullYear() + 5);
              const diffInYears = end.getFullYear() - start.getFullYear();
              if (diffInYears >= 5) {
                notifyError('Year range must be 5 years or less.');
                setValue([start, futureDate]);
              } else {
                setValue([start, end]);
              }
            }
          }}
          maw={400}
        />
      </div>
      <div className="p-4 h-72">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

LineChart.defaultProps = {
  dataFilter: 'orders',
};

export default LineChart;
