import { API_URLS } from '../constants';
import { ApiFunction } from '../interfaces';
import api from './axios';

const handleApiCall = async <T>(
  apiFunction: ApiFunction<T>,
  url: string,
  data: T
) => {
  try {
    const response = await apiFunction(url, data);
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

export const signup = async (data: {
  email: string;
  username: string;
  password: string;
  invitationToken?: string | null;
}) => {
  return handleApiCall(api.post, API_URLS.AUTH_SIGNUP, data);
};

export const signin = async (data: {
  identifier: string;
  password: string;
}) => {
  return handleApiCall(api.post, API_URLS.AUTH_SIGNIN, data);
};

export const verify = async (data: { verificationToken: string }) => {
  return handleApiCall(api.post, API_URLS.AUTH_VERIFY, data);
};

export const confirmEmail = async (data: { confirmationToken: string }) => {
  return handleApiCall(api.post, API_URLS.AUTH_CONFIRM_EMAIL, data);
};
