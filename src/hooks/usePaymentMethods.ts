import { useMutation, useQueryClient,useQuery } from '@tanstack/react-query';
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../api/paymentMethodApi';
import { notifyError, notifySuccess } from '../lib/utils';

export const usePaymentMethods = () => {
  return useQuery(['paymentMethods'], getPaymentMethods);
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(createPaymentMethod, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['paymentMethods']);
      notifySuccess('Payment method created successfully');
    },
    onError: (error) => {
      notifyError('Failed to create payment method');
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(updatePaymentMethod, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['paymentMethods']);
      notifySuccess('Payment method updated successfully');
    },
    onError: (error) => {
      notifyError('Failed to update payment method');
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePaymentMethod, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['paymentMethods']);
      notifySuccess('Payment method deleted successfully');
    },
    onError: (error) => {
      notifyError('Failed to delete payment method');
    },
  });
};
