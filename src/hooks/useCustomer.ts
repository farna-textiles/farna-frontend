// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCustomer, signin } from '../api';
import { notifyError, notifySuccess } from '../lib/utils';
import { ErrorResponse } from '../interfaces';

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

export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation(signin, {
    onSuccess: (data) => {
      notifySuccess('Welcome back!');
      const successKey: QueryKey = ['confirmEmailSuccessMessage'];
      queryClient.setQueryData(successKey, 'Email confirmed successfully');
      queryClient.setQueryData(['userInfo'], data.user);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
    },
    onError: (error: ErrorResponse) => {
      notifyError(error.message);
    },
  });
};
