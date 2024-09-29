import React, { useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import { YearPickerInput } from '@mantine/dates';
import { useCompareTwoYears } from '../../hooks/useDashboard';
import { DashboardDataFilter } from '../../interfaces';

type BarChartProps = {
  currency: number;
  dataFilter: DashboardDataFilter;
};

const BarChart: React.FC<BarChartProps> = ({ currency, dataFilter }) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear1, setSelectedYear1] = useState<Date>(new Date());
  const [selectedYear2, setSelectedYear2] = useState<Date>(
    new Date(currentYear - 1, 0, 1)
  );

  const { data } = useCompareTwoYears(
    {
      year1: selectedYear1.getFullYear().toString(),
      year2: selectedYear2.getFullYear().toString(),
    },
    currency,
    dataFilter
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
        name: `Year ${selectedYear1.getFullYear()}`,
        data: data?.[selectedYear1?.getFullYear()?.toString()] || [],
        type: 'bar',
      },
      {
        name: `Year ${selectedYear2.getFullYear()}`,
        data: data?.[selectedYear2?.getFullYear()?.toString()] || [],
        type: 'bar',
      },
    ],
  };

  return (
    <div className="col-span-2 bg-gray-100 rounded-md shadow-lg hover:bg-gray-50">
      <div className="sm:flex items-center justify-between p-4 border-b">
        <h4 className="text-lg font-semibold text-gray-500">
          Comparison for Two Years
        </h4>
        <div className="flex space-x-4 sm:space-x-6 md:space-x-8 lg:space-x-10 items-center">
          <YearPickerInput
            type="default"
            title="Select Year 1"
            value={selectedYear1}
            onChange={(date) => {
              if (date) setSelectedYear1(date);
            }}
            className="w-24 sm:w-32 md:w-40 lg:w-48"
          />

          <YearPickerInput
            type="default"
            value={selectedYear2}
            title="Select Year 2"
            onChange={(date) => {
              if (date) setSelectedYear2(date);
            }}
            className="w-24 sm:w-32 md:w-40 lg:w-48"
          />
        </div>
      </div>
      <div className="p-4 h-72 sm:h-96 md:h-80 lg:h-96 xl:h-80">
        <ReactEcharts option={option} style={{ height: '100%' }} />
      </div>
    </div>
  );
};

export default BarChart;
