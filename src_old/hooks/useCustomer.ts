// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  updateCustomer,
} from '../api';
import { notifyError, notifySuccess } from '../lib/utils';
import { Customer, ErrorResponse } from '../interfaces';

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCustomer, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['Customers']);
      notifySuccess('Customer deleted successfully');
    },

    onError() {
      notifyError('Failed to delete customer');
    },
  });
};

export const useCustomer = (customerId: number) => {
  return useQuery(['customer', customerId], () => getCustomer(customerId));
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useMutation<any, ErrorResponse, [number, Customer]>(updateCustomer, {
    onSuccess: async () => {
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

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(createCustomer, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['customer']);
      navigate(`/customers/${data.id}`);
      notifySuccess('Customer created successfully');
    },

    onError: async (error: ErrorResponse) => {
      await queryClient.invalidateQueries(['customer']);

      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};
