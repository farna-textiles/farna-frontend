import { API_URLS } from '../constants';
import api from './axios';
import { handleApiCall } from '../lib/utils';

const handleCurrencyUnitApiCall = async (method, url, data = {}) => {
  return handleApiCall(method, url, data);
};

export const getCurrencyUnits = async () => {
  const apiUrl = API_URLS.CURRENCY_UNITS.ALL;
  return handleCurrencyUnitApiCall(api.get, apiUrl);
};

export const createCurrencyUnit = async ({ name, code, symbol }) => {
  const apiUrl = API_URLS.CURRENCY_UNITS.ALL;
  const createCurrencyUnitDto = { name, code, symbol };
  return handleCurrencyUnitApiCall(api.post, apiUrl, createCurrencyUnitDto);
};


export const updateCurrencyUnit = async (id, updateCurrencyUnitDto) => { 
  const apiUrl = `${API_URLS.CURRENCY_UNITS.ALL}/${id}`;
  return handleCurrencyUnitApiCall(api.put, apiUrl, updateCurrencyUnitDto); 
};

export const deleteCurrencyUnit = async (id) => {
  const apiUrl = `${API_URLS.CURRENCY_UNITS.ALL}/${id}`;
  return handleCurrencyUnitApiCall(api.delete, apiUrl);
};
