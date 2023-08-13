// eslint-disable-next-line import/prefer-default-export
export const API_URLS = {
  AUTH_SIGNUP: '/auth/signup',
  AUTH_SIGNIN: '/auth/signin',
  AUTH_VERIFY: '/auth/verify',
  AUTH_CONFIRM_EMAIL: '/auth/confirm-email',
  ALL_USERS: '/users',
  ALL_CUSTOMERS: '/customers',
  DELETE_CUSTOMER: '/customers/:id',
  GET_CUSTOMER: '/customers/:id',
  UPDATE_CUSTOMER: '/customers/:id',
  CREATE_CUSTOMER: '/customers',
  Products: {
    ALL_PRODUCTS: '/products',
    UPDATE_PRODUCT: '/products/:id',
    DELETE_PRODUCT: '/products/:id',
    CREATE_PRODUCT: '/products',
    GET_PRODUCT: '/products/:id',
  },
  EndUse: {
    ALL: '/end-use',
    CREATE: '/end-use',
  },
};
