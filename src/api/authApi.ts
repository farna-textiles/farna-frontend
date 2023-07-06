import api from './axios';

export const signup = async (data: {
  email: string;
  username: string;
  password: string;
  invitationToken?: string | null;
}) => {
  const response = await api.post('auth/signup', data);
  return response.data;
};

export const signin = async (data: {
  identifier: string;
  password: string;
}) => {
  const response = await api.post('auth/signin', data);
  return response.data;
};

export const verify = async (data: { verificationToken: string }) => {
  const response = await api.post('auth/verify', data);
  return response.data;
};

export const confirmEmail = async (data: { confirmationToken: string }) => {
  const response = await api.post('auth/confirm-email', data);
  return response.data;
};
