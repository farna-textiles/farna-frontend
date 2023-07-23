// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteCustomer, getCustomer, updateCustomer } from '../api';
import { notifyError, notifySuccess } from '../lib/utils';
import { Customer, ErrorResponse } from '../interfaces';

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCustomer, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['Customers']);
      notifySuccess('Customer deleted successfully');
    },

    onError(error, variables, context) {
      notifyError('Failed to delete customer');
    },
  });
};

export const useCustomer = (customerId: number) => {
  return useQuery(['customer', customerId], () => getCustomer(customerId));
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation<any, ErrorResponse, [number, Customer]>(updateCustomer, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['customer']);
      notifySuccess('Customer updated successfully');
    },

    onError: async (error: ErrorResponse) => {
      await queryClient.invalidateQueries(['customer']);

      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};
