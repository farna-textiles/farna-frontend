// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { ApiFunction } from '../interfaces';
import { userInfo } from '../services/authService';

export const notifySuccess = (text: string) =>
  toast.success(text, { theme: 'light' });
export const notifyError = (text: string) =>
  toast.error(text, { theme: 'light' });

export const handleApiCall = async <T>(
  apiFunction: ApiFunction<T>,
  url: string,
  data: T
) => {
  try {
    const response = await apiFunction(url, data);
    return response.data;
  } catch (error: any) {
    if (error.code === 'ERR_BAD_REQUEST' && !userInfo()) {
      // redirect to sign in
    }
    throw error.response.data;
  }
};
