import { API_URLS } from '../constants';
import api from './axios';

const getCurrencyUnits = async () => {
  const response = await api.get(API_URLS.CURRENCY_UNITS.ALL, {});
  return response.data;
};

export default getCurrencyUnits;
