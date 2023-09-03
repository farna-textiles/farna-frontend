import { API_URLS } from '../constants';
import { handleApiCall } from '../lib/utils';
import api from './axios';

const getStatistics = async (timeFilter: 'week' | 'month' | 'year') => {
  return handleApiCall(api.get, API_URLS.DASHBOARD_METHODS.STATISTICS, {
    params: { timeFilter },
  });
};

export default getStatistics;
