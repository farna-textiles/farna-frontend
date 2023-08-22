import { API_URLS } from '../constants';
import { Order, PaginatedResponse, ProductOrderType } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const createOrder = async (data: Omit<ProductOrderType, 'id'>) => {
  return handleApiCall(api.post, API_URLS.ORDER_METHODS.CREATE, data);
};

export const getAllOrders = async (
  page: number,
  pageSize: number,
  searchQuery: string
): Promise<PaginatedResponse<Order>> => {
  const response = await api.get(API_URLS.ORDER_METHODS.ALL, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};
