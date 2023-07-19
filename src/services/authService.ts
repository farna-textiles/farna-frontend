// eslint-disable-next-line import/no-extraneous-dependencies
import Cookies from 'js-cookie';

export const isAuthenticated = () => {
  //const hasLocalStorageToken = !!localStorage.getItem('access_token');
  //const hasCookieToken = !!Cookies.get('access_token');
  //return hasLocalStorageToken || hasCookieToken;
  return true
};

export const userHasPermission = (path: string) => {
  // Replace with your actual implementation
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  return true;
  // return permissions.includes(path);
};
