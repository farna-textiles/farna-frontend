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

const updatePaymentMethodMutation = async ({ id, ...updatedPaymentMethodData }) => {
  return updatePaymentMethod(id, updatedPaymentMethodData);
};

export const useCreatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(createPaymentMethod, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['paymentMethods']);
      notifySuccess('Payment method created successfully');
    },
    onError: () => {
      notifyError('Failed to create payment method');
    },
  });
};

export const useUpdatePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(updatePaymentMethodMutation, {
    onMutate: async (variables) => {
      const { id } = variables;
      await queryClient.invalidateQueries(['paymentMethods', id]);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['paymentMethods']);
      notifySuccess('Payment method updated successfully');
    },
    onError: () => {
      notifyError('Failed to update payment method');
    },
  });
};

export const useDeletePaymentMethod = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePaymentMethod, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['paymentMethods']);
      notifySuccess('Payment method deleted successfully');
    },
    onError: () => {
      notifyError('Failed to delete payment method');
    },
  });
};
