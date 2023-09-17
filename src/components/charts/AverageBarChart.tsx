import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { YearPickerInput } from '@mantine/dates';
import { useCompareAverage } from '../../hooks/useDashboard';
import { CompareRangeType } from '../../interfaces';

const AverageBarChart: React.FC = () => {
  const currentDate = new Date();
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(currentDate.getFullYear() - 5);
  const [value, setValue] = useState<[Date | null, Date | null]>([
    fiveYearsAgo,
    currentDate,
  ]);

  const { data } = useCompareAverage({
    startYear: value[0]?.getFullYear() ?? 2018,
    endYear: value[1]?.getFullYear() ?? 2023,
  }) as { data: CompareRangeType[] };

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
    <div className="col-span-1 bg-white rounded-md dark:bg-darker">
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

export default AverageBarChart;
