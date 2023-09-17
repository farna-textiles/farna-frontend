import { useQuery } from '@tanstack/react-query';
import {
  compareTwoYears,
  getStatistics,
  getDmographic,
  compareYearInRange,
  averageInRange,
} from '../api/dashboardApi';

export const useDashboardCards = (timeFilter: 'week' | 'month' | 'year') => {
  return useQuery(['dashboardCards', timeFilter], () =>
    getStatistics(timeFilter)
  );
};

export const useCompareTwoYears = (years: { year1: string; year2: string }) => {
  return useQuery(['dashboardTwoYears', years], () => compareTwoYears(years));
};

export const useDashboardDmographic = (sortBy: string, filterBy: string) => {
  return useQuery(['dashboardDmographic', sortBy, filterBy], () =>
    getDmographic(sortBy, filterBy)
  );
};

export const useCompareYears = (years: {
  startYear: number;
  endYear: number;
}) => {
  return useQuery(['dashboardYears', years], () => compareYearInRange(years));
};

export const useCompareAverage = (years: {
  startYear: number;
  endYear: number;
}) => {
  return useQuery(['dashboardAverage', years], () => averageInRange(years));
};
