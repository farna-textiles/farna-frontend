/* eslint-disable import/no-extraneous-dependencies */
import { MutationFunction } from '@tanstack/query-core';
import { API_URLS } from '../constants';
import { Customer, PaginatedResponse, User } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const getAllCustomers = async (
  page: number,
  pageSize: number,
  searchQuery: string
): Promise<PaginatedResponse<Customer>> => {
  const response = await api.get(API_URLS.ALL_CUSTOMERS, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};

export const getCustomers = async (
  page: number,
  searchQuery: string,
  pageSize = 5
): Promise<PaginatedResponse<Customer>> => {
  const response = await api.get(API_URLS.ALL_CUSTOMERS, {
    params: {
      limit: pageSize,
      page,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};

export const deleteCustomer = async (id: number, data = {}) => {
  const apiUrl = API_URLS.DELETE_CUSTOMER.replace(':id', String(id));

  return handleApiCall(api.delete, apiUrl, data);
};

export const getCustomer = async (id: number, data = {}) => {
  const apiUrl = API_URLS.GET_CUSTOMER.replace(':id', String(id));

  return handleApiCall(api.get, apiUrl, data);
};

export const createCustomer = async (data: Omit<Customer, 'id'>) => {
  return handleApiCall(api.post, API_URLS.CREATE_CUSTOMER, data);
};

export const updateCustomer: MutationFunction<any, [number, Customer]> = async (
  params
) => {
  const [id, data] = params;
  const apiUrl = API_URLS.UPDATE_CUSTOMER.replace(':id', String(id));

  return handleApiCall(api.put, apiUrl, data);
};
