import { API_URLS } from '../constants';
import api from './axios';

const getPaymentMethods = async () => {
  const response = await api.get(API_URLS.PAYMENT_METHODS.ALL, {});
  return response.data;
};

export default getPaymentMethods;
