import { API_URLS } from '../constants';
import { ProductOrderType } from '../interfaces';
import { handleApiCall } from '../lib/utils';
import api from './axios';

const createOrder = async (data: Omit<ProductOrderType, 'id'>) => {
  return handleApiCall(api.post, API_URLS.ORDER_METHODS.CREATE, data);
};

export default createOrder;
