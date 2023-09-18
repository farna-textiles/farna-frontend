import { API_URLS } from '../constants';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const getStatistics = async (
  timeFilter: 'week' | 'month' | 'year',
  currencyUnitId: number
) => {
  return handleApiCall(api.get, API_URLS.DASHBOARD_METHODS.STATISTICS, {
    params: { timeFilter, currencyUnitId },
  });
};

export const compareTwoYears = async (
  years: {
    year1: string;
    year2: string;
  },
  currencyUnitId: number
) => {
  return handleApiCall(api.get, API_URLS.DASHBOARD_METHODS.COMPARE_TWO_YEARS, {
    params: { years, currencyUnitId },
  });
};

export const getDmographic = async (
  dataFilter: string,
  locationFilter: string,
  currencyUnitId: number
) => {
  const url = API_URLS.DASHBOARD_METHODS.DEMOGRAPHICS;
  const params = {
    dataFilter,
    locationFilter,
    currencyUnitId,
  };

  return handleApiCall(api.get, url, { params });
};

export const compareYearInRange = async (
  yearRange: {
    startYear: number;
    endYear: number;
  },
  dataFilter: string,
  currencyUnitId: number
) => {
  return handleApiCall(
    api.get,
    API_URLS.DASHBOARD_METHODS.COMPARE_YEARS_IN_RANGE,
    {
      params: {
        startYear: yearRange.startYear,
        endYear: yearRange.endYear,
        dataFilter,
        currencyUnitId,
      },
    }
  );
};

export const averageInRange = async (
  yearRange: {
    startYear: number;
    endYear: number;
  },
  dataFilter: string,
  currencyUnitId: number
) => {
  return handleApiCall(api.get, API_URLS.DASHBOARD_METHODS.AVERAGE_IN_RANGE, {
    params: {
      startYear: yearRange.startYear,
      endYear: yearRange.endYear,
      dataFilter,
      currencyUnitId,
    },
  });
};
