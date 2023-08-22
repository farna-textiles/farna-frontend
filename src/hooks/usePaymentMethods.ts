import { useQuery } from '@tanstack/react-query';
import getPaymentMethods from '../api/paymentMethodApi';

const usePaymentMethods = () => {
  return useQuery(['paymentMethods'], () => getPaymentMethods());
};

export default usePaymentMethods;
