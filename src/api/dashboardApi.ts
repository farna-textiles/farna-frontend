import { API_URLS } from '../constants';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const getStatistics = async (timeFilter: 'week' | 'month' | 'year') => {
  return handleApiCall(api.get, API_URLS.DASHBOARD_METHODS.STATISTICS, {
    params: { timeFilter },
  });
};

export const compareTwoYears = async (years: {
  year1: string;
  year2: string;
}) => {
  return handleApiCall(
    api.post,
    API_URLS.DASHBOARD_METHODS.COMPARE_TWO_YEARS,
    years
  );
};

export const getDmographic = async (sortBy: string, filterBy: string) => {
  const url = API_URLS.DASHBOARD_METHODS.DEMOGRAPHICS;
  const data = {
    sortBy,
    filterBy,
  };

  return handleApiCall(api.post, url, data);
};
