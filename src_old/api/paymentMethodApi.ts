import { MutationFunction } from '@tanstack/react-query';
import { API_URLS } from '../constants';
import api from './axios';
import { PaginatedResponse, PaymentMethod } from '../interfaces';
import { handleApiCall } from '../lib/utils';

export const getAllPaymentTypes = async (
  page = -1,
  pageSize?: number,
  searchQuery?: string
): Promise<PaginatedResponse<PaymentMethod>> => {
  const response = await handleApiCall(api.get, API_URLS.PAYMENT_METHODS.ALL, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
    },
  })
  
  return response;
};

export const createPaymentMethod = async (paymentMethod: PaymentMethod) => {
  return handleApiCall(
    api.post,
    API_URLS.PAYMENT_METHODS.CREATE,
    paymentMethod
  );
};

export const updatePaymentMethod: MutationFunction<
  any,
  [number, PaymentMethod]
> = async (params) => {
  const [id, data] = params;
  const apiUrl = API_URLS.PAYMENT_METHODS.UPDATE.replace(':id', String(id));

  return handleApiCall(api.put, apiUrl, data);
};

export const deletePaymentMethod = async (id: number, data = {}) => {
  const apiUrl = API_URLS.PAYMENT_METHODS.DELETE.replace(':id', String(id));
  return handleApiCall(api.delete, apiUrl, data);
};
