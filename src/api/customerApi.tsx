import { API_URLS } from '../constants';
import { PaginatedResponse, User } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const getAllCustomers = async (
  page: number,
  pageSize: number,
  searchQuery: string
): Promise<PaginatedResponse<User>> => {
  const response = await api.get(API_URLS.ALL_CUSTOMERS, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};

export const deleteCustomer = async (id: number, data = {}) => {
  const apiUrl = API_URLS.DELETE_CUSTOMER.replace(':id', String(id));

  return handleApiCall(api.delete, apiUrl, data);
};
