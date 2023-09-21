import { API_URLS } from '../constants';
import api from './axios';
import { handleApiCall } from '../lib/utils';

const handlePaymentMethodApiCall = async (method, url, data = {}) => {
  return handleApiCall(method, url, data);
};

export const getPaymentMethods = async () => {
  const apiUrl = API_URLS.PAYMENT_METHODS.ALL;
  return handlePaymentMethodApiCall(api.get, apiUrl);
};

export const createPaymentMethod = async (paymentMethodData) => {
  const apiUrl = API_URLS.PAYMENT_METHODS.ALL;
  return handlePaymentMethodApiCall(api.post, apiUrl, paymentMethodData);
};

export const updatePaymentMethod = async (id, updatedPaymentMethodData) => {
  const apiUrl = `${API_URLS.PAYMENT_METHODS.ALL}/${id}`;
  return handlePaymentMethodApiCall(api.put, apiUrl, updatedPaymentMethodData);
};

export const deletePaymentMethod = async (id) => {
  const apiUrl = `${API_URLS.PAYMENT_METHODS.ALL}/${id}`;
  return handlePaymentMethodApiCall(api.delete, apiUrl);
};
