import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { notifyError, notifySuccess } from '../lib/utils';
import { ErrorResponse, Order, OrderUpdateData } from '../interfaces';
import { createOrder, deleteOrder, getOrder, updateOrder } from '../api';

export const useCraeteOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(createOrder, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['Orders']);
      navigate(`/orders`);
      notifySuccess('Product Order created successfully');
    },

    onError: async (error: ErrorResponse) => {
      await queryClient.invalidateQueries(['Orders']);

      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};

export const useOrder = (orderId: number, initialData?: Order) => {
  return useQuery(['order', orderId], () => getOrder(orderId), {
    initialData,
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<any, ErrorResponse, [number, OrderUpdateData]>(
    updateOrder,
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(['Orders']);
        await queryClient.invalidateQueries(['order']);
        navigate(`/orders/${data.id}/invoice`);

        notifySuccess('Order updated successfully');
      },

      onError: async (error: ErrorResponse) => {
        await queryClient.invalidateQueries(['Orders']);

        notifyError(
          typeof error.message === 'object' ? error.message[0] : error.message
        );
      },
    }
  );
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteOrder, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['Orders']);
      notifySuccess('Customer deleted successfully');
    },

    onError(error, variables, context) {
      notifyError('Failed to delete customer');
    },
  });
};
