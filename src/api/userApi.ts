import { MutationFunction } from '@tanstack/react-query';
import { API_URLS } from '../constants';
import { PaginatedResponse, User, UpdateUserRequest } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

export const getAllUsers = async (
  page: number,
  pageSize: number,
  searchQuery: string
): Promise<PaginatedResponse<User>> => {
  const response = await api.get(API_URLS.ALL_USERS, {
    params: {
      limit: pageSize,
      page: page + 1,
      searchTerm: searchQuery,
    },
  });
  return response.data;
};

export const getAllUser = async (data: { confirmationToken: string }) => {
  return handleApiCall(api.post, API_URLS.AUTH_CONFIRM_EMAIL, data);
};

export const updateUser: MutationFunction<
  any,
  [number, UpdateUserRequest]
> = async (params) => {
  const [id, data] = params;
  const apiUrl = API_URLS.UPDATE_USER.replace(':id', String(id));

  return handleApiCall(api.put, apiUrl, data);
};

export const getUserById = async (id: number, data = {}) => {
  const apiUrl = API_URLS.GET_USER_BY_ID.replace(':id', String(id));

  return handleApiCall(api.get, apiUrl, data);
};

export const changePassword = async (data = {}) => {
  return handleApiCall(api.put, API_URLS.AUTH_CHANGE_PASSWORD, data);
};

export const deleteUser = async (id: number, data = {}) => {
  const apiUrl = API_URLS.DELETE_USER.replace(':id', String(id));

  return handleApiCall(api.delete, apiUrl, data);
};
