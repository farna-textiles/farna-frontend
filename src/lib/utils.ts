// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { ApiFunction } from '../interfaces';
import { isAuthenticated } from '../services/authService';

export const notifySuccess = (text: string) =>
  toast.success(text, { theme: 'light' });
export const notifyError = (text: string) =>
  toast.error(text, { theme: 'light' });

export const handleApiCall = async <T>(
  apiFunction: ApiFunction,
  url: string,
  data: T
) => {
  try {
    const response = await apiFunction(url, data);
    return response.data;
  } catch (error: any) {
    if (
      error.response.data.statusCode === 401 &&
      error.response.data.message === 'Unauthorized' &&
      !isAuthenticated()
    ) {
      window.location.href = '/signin';
    }
    throw error?.response?.data;
  }
};
