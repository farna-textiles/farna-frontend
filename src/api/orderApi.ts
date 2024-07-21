import { MutationFunction } from '@tanstack/react-query';
import { API_URLS } from '../constants';
import {
  Order,
  OrderUpdateData,
  PaginatedResponse,
  ProductOrderType,
} from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const createOrder = async (data: Omit<ProductOrderType, 'id'>) => {
  return handleApiCall(api.post, API_URLS.ORDER_METHODS.CREATE, data);
};

export const getAllOrders = async (
  page: number,
  pageSize: number,
  searchQuery: string,
  sortby: string,
  groupBy?: string | null,
  reportPeriod?: string,
  start_date?: string,
  end_date?: string
): Promise<PaginatedResponse<Order>> => {
  const response = await api.get(API_URLS.ORDER_METHODS.ALL, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
      sort_by: sortby,
      group_by: groupBy,
      report_period: reportPeriod,
      start_date: start_date,
      end_date: end_date,
    },
  });

  return response.data;
};

export const getOrder = async (id: number, data = {}) => {
  const apiUrl = API_URLS.ORDER_METHODS.GET.replace(':id', String(id));

  return handleApiCall(api.get, apiUrl, data);
};

export const updateOrder: MutationFunction<
  any,
  [number, OrderUpdateData]
> = async (params) => {
  const [id, data] = params;
  const apiUrl = API_URLS.ORDER_METHODS.UPDATE.replace(':id', String(id));

  return handleApiCall(api.put, apiUrl, data);
};

export const deleteOrder = async (id: number, data = {}) => {
  const apiUrl = API_URLS.ORDER_METHODS.DELETE.replace(':id', String(id));

  return handleApiCall(api.delete, apiUrl, data);
};
