import { API_URLS } from '../constants';
import { PaginatedResponse, User } from '../interfaces';
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
