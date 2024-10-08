// eslint-disable-next-line import/prefer-default-export
export const API_URLS = {
  AUTH_SIGNUP: '/auth/signup',
  AUTH_SIGNIN: '/auth/signin',
  AUTH_VERIFY: '/auth/verify',
  AUTH_INVITE: '/auth/invite',
  AUTH_CONFIRM_EMAIL: '/auth/confirm-email',
  AUTH_CHANGE_PASSWORD: '/auth/change-password',
  ALL_USERS: '/users',
  DELETE_USER: '/users/:id',
  UPDATE_USER: '/users/:id',
  GET_USER_BY_ID: '/users/:id',
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
  CURRENCY_UNITS: {
    ALL: '/currency-unit',
    UPDATE: '/currency-unit/:id',
    CREATE: '/currency-unit',
    DELETE: '/currency-unit/:id',
  },
  PAYMENT_METHODS: {
    ALL: '/payment-types',
    CREATE: '/payment-types',
    UPDATE: '/payment-types/:id',
    DELETE: '/payment-types/:id',
  },
  ORDER_METHODS: {
    CREATE: '/orders',
    ALL: '/orders',
    GET: '/orders/:id',
    UPDATE: '/orders/:id',
    DELETE: '/orders/:id',
  },
  REACTIVATION_REQUEST: '/auth/reactivation',
  DASHBOARD_METHODS: {
    STATISTICS: '/dashboard/statistics',
    COMPARE_TWO_YEARS: '/dashboard/compare',
    DEMOGRAPHICS: '/dashboard/demographic',
    COMPARE_YEARS_IN_RANGE: '/dashboard/compare-range',
    AVERAGE_IN_RANGE: '/dashboard/average',
  },
};
