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

export interface UpdateUserRequest {
  id: number;
  username: string;
  role: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  isActive?: boolean;
}
export const updateUser = async (
  userId: string,
  userData: UpdateUserRequest
): Promise<User> => {
  const url = API_URLS.UPDATE_USER.replace(':id', userId);

  try {
    const response = await api.put(url, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Failed to update user');
  } catch (error: any) {
    throw error.response.data;
  }
};
