import { useQuery } from '@tanstack/react-query';
import getStatistics from '../api/dashboardApi';

const useDashboardCards = (timeFilter: 'week' | 'month' | 'year') => {
  return useQuery(['dashboardCards', timeFilter], () =>
    getStatistics(timeFilter)
  );
};

export default useDashboardCards;
