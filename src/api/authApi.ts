import { API_URLS } from '../constants';
import { InviteUser } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

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

export const invite = async (data: InviteUser) => {
  return handleApiCall(api.post, API_URLS.AUTH_INVITE, data);
};

export const confirmEmail = async (data: { confirmationToken: string }) => {
  return handleApiCall(api.post, API_URLS.AUTH_CONFIRM_EMAIL, data);
};

export const reactivation = async (data: {
  identifier: string;
  password: string;
}) => {
  return handleApiCall(api.post, API_URLS.REACTIVATION_REQUEST, data);
};
