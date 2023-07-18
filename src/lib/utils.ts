// eslint-disable-next-line import/no-extraneous-dependencies
import { toast } from 'react-toastify';
import { ApiFunction } from '../interfaces';

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
    if (error.response.data.error === 'Forbidden')
      error.response.data = {
        ...error.response.data,
        message: 'Access Denied (Unauthorized Resource)',
      };
    throw error.response.data;
  }
};
