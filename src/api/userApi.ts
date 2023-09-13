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

export const getUserById = async (userId) => {
  try {
    const response = await api.get(
      API_URLS.GET_USER_BY_ID.replace(':id', userId),
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    }

    throw new Error('Failed to fetch user data');
  } catch (error) {
    throw new Error(`Error fetching user data by ID: ${error.message}`);
  }
};

// export const handleTheLogout = async () => {
//   try {
//     localStorage.clear();
//     const response = await api.post(API_URLS.LOGOUT);
//     if (response.status === 200) {
//     } else {
//       console.error('Logout failed');
//     }
//   } catch (error) {
//     console.error('Error during logout:', error);
//   }
// };
