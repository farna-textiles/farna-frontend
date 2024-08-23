import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createPaymentMethod,
  deletePaymentMethod,
  updatePaymentMethod,
} from '../api/paymentMethodApi';
import { notifyError, notifySuccess } from '../lib/utils';
import { ErrorResponse, PaymentMethod } from '../interfaces';

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation<any, ErrorResponse, [number, PaymentMethod]>(
    updatePaymentMethod,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['Payment Methods']);

        notifySuccess('Currency unit updated successfully');
      },

      onError: async (error: ErrorResponse) => {
        await queryClient.invalidateQueries(['Payment Methods']);

        notifyError(
          typeof error.message === 'object' ? error.message[0] : error.message
        );
      },
    }
  );
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(createPaymentMethod, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['Payment Methods']);
      notifySuccess('Payment method created successfully');
    },
    onError: () => {
      notifyError('Failed to create payment method');
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePaymentMethod, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['Payment Methods']);
      notifySuccess('Payment method deleted successfully');
    },
    onError: (error: ErrorResponse) => {
      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};
