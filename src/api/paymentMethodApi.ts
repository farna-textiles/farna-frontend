import { API_URLS } from '../constants';
import api from './axios';
import { handleApiCall } from '../lib/utils';
import { PaymentMethod } from '../interfaces';



const handlePaymentMethodApiCall = async <T>(
  method: any, 
  url: string,
  data: Record<string, any> = {}
): Promise<T> => {
  return handleApiCall(method, url, data);
};

export const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
  const apiUrl = API_URLS.PAYMENT_METHODS.ALL;
  return handlePaymentMethodApiCall(api.get, apiUrl);
};

export const createPaymentMethod = async (
  paymentMethodData: Partial<PaymentMethod>
): Promise<PaymentMethod> => {
  const apiUrl = API_URLS.PAYMENT_METHODS.ALL;
  return handlePaymentMethodApiCall(api.post, apiUrl, paymentMethodData);
};

export const updatePaymentMethod = async (
  id: number,
  updatedPaymentMethodData: Partial<PaymentMethod>
): Promise<PaymentMethod> => {
  const apiUrl = `${API_URLS.PAYMENT_METHODS.ALL}/${id}`;
  return handlePaymentMethodApiCall(api.put, apiUrl, updatedPaymentMethodData);
};

export const deletePaymentMethod = async (id: number): Promise<void> => {
  const apiUrl = `${API_URLS.PAYMENT_METHODS.ALL}/${id}`;
  return handlePaymentMethodApiCall(api.delete, apiUrl);
};
