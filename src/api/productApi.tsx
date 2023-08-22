import { MutationFunction } from '@tanstack/react-query';
import { API_URLS } from '../constants';
import { PaginatedResponse, Product, ProductUpdateData } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const getAllProducts = async (
  page: number,
  pageSize: number,
  searchQuery: string
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get(API_URLS.Products.ALL_PRODUCTS, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};

export const getProducts = async (
  page: number,
  searchQuery: string,
  pageSize = 5
): Promise<PaginatedResponse<Product>> => {
  const response = await api.get(API_URLS.Products.ALL_PRODUCTS, {
    params: {
      limit: pageSize,
      page,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number, data = {}) => {
  const apiUrl = API_URLS.Products.DELETE_PRODUCT.replace(':id', String(id));
  return handleApiCall(api.delete, apiUrl, data);
};

export const getProduct = async (id: number, data = {}) => {
  const apiUrl = API_URLS.Products.GET_PRODUCT.replace(':id', String(id));

  return handleApiCall(api.get, apiUrl, data);
};

export const createProduct = async (data: Product) => {
  return handleApiCall(api.post, API_URLS.Products.CREATE_PRODUCT, data);
};

export const updateProduct: MutationFunction<
  any,
  [number, ProductUpdateData]
> = async (params) => {
  const [id, data] = params;
  const apiUrl = API_URLS.Products.UPDATE_PRODUCT.replace(':id', String(id));

  return handleApiCall(api.put, apiUrl, data);
};
