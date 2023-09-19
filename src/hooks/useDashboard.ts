import { useQuery } from '@tanstack/react-query';
import {
  compareTwoYears,
  getStatistics,
  getDmographic,
  compareYearInRange,
  averageInRange,
} from '../api/dashboardApi';

export const useDashboardCards = (
  timeFilter: 'week' | 'month' | 'year',
  currencyUnitId: number
) => {
  return useQuery(['dashboardCards', timeFilter, currencyUnitId], () =>
    getStatistics(timeFilter, currencyUnitId)
  );
};

export const useCompareTwoYears = (
  years: { year1: string; year2: string },
  currencyUnitId: number
) => {
  return useQuery(['dashboardTwoYears', years, currencyUnitId], () =>
    compareTwoYears(years, currencyUnitId)
  );
};

export const useDashboardDmographic = (
  dataFilter: string,
  locationFilter: string,
  currencyUnitId: number
) => {
  return useQuery(
    ['dashboardDmographic', dataFilter, locationFilter, currencyUnitId],
    () => getDmographic(dataFilter, locationFilter, currencyUnitId)
  );
};

export const useCompareYears = (
  yearRange: {
    startYear: number | undefined;
    endYear: number | undefined;
  },
  dataFilter: string,
  currencyUnitId: number
) => {
  return useQuery(
    ['dashboardYears', yearRange, currencyUnitId, dataFilter],
    () => compareYearInRange(yearRange, dataFilter, currencyUnitId)
  );
};

export const useCompareAverage = (
  yearRange: {
    startYear: number | undefined;
    endYear: number | undefined;
  },
  dataFilter: string,
  currencyUnitId: number
) => {
  return useQuery(
    ['dashboardAverage', yearRange, dataFilter, currencyUnitId],
    () => averageInRange(yearRange, dataFilter, currencyUnitId)
  );
};
