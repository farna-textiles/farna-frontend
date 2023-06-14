export const isAuthenticated = () => {
  // Replace with your actual implementation
  return true;
  // return !!localStorage.getItem('token');
};

export const userHasPermission = (path: string) => {
  // Replace with your actual implementation
  const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
  return true;
  // return permissions.includes(path);
};
