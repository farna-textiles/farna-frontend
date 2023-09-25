// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie';
import { User } from '../interfaces';

export const isAuthenticated = () => {
  const hasLocalStorageToken = !!localStorage.getItem('access_token');
  const hasCookieToken = !!Cookies.get('access_token');
  return hasLocalStorageToken || hasCookieToken;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const userHasPermission = (_path: string) => {
  // Replace with your actual implementation
  // const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  return true;
  // return permissions.includes(path);
};

export const userInfo = () => {
  const userInfoString = localStorage.getItem('userInfo');
  const user: User = userInfoString ? JSON.parse(userInfoString) : null;
  return user;
};

export const logout = () => {
  localStorage.clear();
  document.cookie =
    'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie =
    'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};
