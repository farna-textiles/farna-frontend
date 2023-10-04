import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { YearPickerInput } from '@mantine/dates';
import { useCompareAverage } from '../../hooks/useDashboard';
import { CompareRangeType } from '../../interfaces';
import { notifyError } from '../../lib/utils';

type AverageBarChartProps = {
  currency: number;
  dataFilter?: 'orders' | 'earnings';
};

const AverageBarChart: React.FC<AverageBarChartProps> = ({
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

  const { data } = useCompareAverage(
    {
      startYear: value[0]?.getFullYear(),
      endYear: value[1]?.getFullYear(),
    },
    dataFilter,
    currency
  ) as { data: CompareRangeType[] };

  const option = {
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
        name: `Year`,
        data,
        type: 'bar',
      },
    ],
  };

  return (
    <div className="col-span-2 bg-gray-100 xl:col-span-1 rounded-md shadow-lg dark:bg-gray-900 hover:bg-gray-700">
    <div className="flex items-center justify-between p-4 border-b dark:border-primary">
      <h4 className="text-lg font-semibold text-gray-500 dark:text-white">
        Averages Over Multiple Years
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
          className="dark:text-white color bg-white"
        />
      </div>
      <div className="relative p-4 h-72">
        <ReactEcharts option={option} />
      </div>
    </div>
  );
};

AverageBarChart.defaultProps = {
  dataFilter: 'orders',
};

export default AverageBarChart;
