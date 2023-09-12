import { useQuery } from '@tanstack/react-query';
import { compareTwoYears, getStatistics } from '../api/dashboardApi';

export const useDashboardCards = (timeFilter: 'week' | 'month' | 'year') => {
  return useQuery(['dashboardCards', timeFilter], () =>
    getStatistics(timeFilter)
  );
};

export const useCompareTwoYears = (years: { year1: string; year2: string }) => {
  return useQuery(['dashboardCards', years], () => compareTwoYears(years));
};
