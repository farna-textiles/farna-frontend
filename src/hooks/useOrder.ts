import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { notifyError, notifySuccess } from '../lib/utils';
import {
  ErrorResponse,
  Order,
  OrderUpdateData,
  ProductOrderType,
} from '../interfaces';
import { createOrder, getOrder, updateOrder } from '../api';

export const useCraeteOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(createOrder, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['orders']);
      navigate(`/orders`);
      notifySuccess('Product Order created successfully');
    },

    onError: async (error: ErrorResponse) => {
      await queryClient.invalidateQueries(['orders']);

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

  return useMutation<any, ErrorResponse, [number, OrderUpdateData]>(
    updateOrder,
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(['orders']);
        await queryClient.invalidateQueries(['order']);

        notifySuccess('Order updated successfully');
      },

      onError: async (error: ErrorResponse) => {
        await queryClient.invalidateQueries(['orders']);

        notifyError(
          typeof error.message === 'object' ? error.message[0] : error.message
        );
      },
    }
  );
};
