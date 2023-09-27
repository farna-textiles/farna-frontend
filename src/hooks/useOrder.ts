import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { notifyError, notifySuccess } from '../lib/utils';
import { ErrorResponse, Order, OrderUpdateData } from '../interfaces';
import { createOrder, deleteOrder, getOrder, updateOrder } from '../api';

const extractLastErrorMessagePart = (errorMessage: string) => {
  const parts = errorMessage.split('.');

  const lastPart = parts[parts.length - 1].trim();

  const capitalizedLastPart =
    lastPart.charAt(0).toUpperCase() + lastPart.slice(1);

  return capitalizedLastPart;
};

export const useCraeteOrder = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(createOrder, {
    onSuccess: async () => {
      await queryClient.invalidateQueries([
        'dashboardCards',
        'Orders',
        'dashboardTwoYears',
        'dashboardDmographic',
        'dashboardYears',
        'dashboardAverage',
      ]);
      navigate(`/orders`);
      notifySuccess('Product Order created successfully');
    },

    onError: async (error: ErrorResponse) => {
      await queryClient.invalidateQueries(['Orders']);

      notifyError(
        typeof error.message === 'object'
          ? extractLastErrorMessagePart(error.message[0])
          : error.message
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useMutation<any, ErrorResponse, [number, OrderUpdateData]>(
    updateOrder,
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries([
          'dashboardCards',
          'Orders',
          'dashboardTwoYears',
          'dashboardDmographic',
          'dashboardYears',
          'dashboardAverage',
          'order',
          'Orders',
        ]);
        navigate(`/orders/${data.id}/invoice`);

        notifySuccess('Order updated successfully');
      },

      onError: async (error: ErrorResponse) => {
        await queryClient.invalidateQueries(['Orders']);

        notifyError(
          typeof error.message === 'object'
            ? extractLastErrorMessagePart(error.message[0])
            : error.message
        );
      },
    }
  );
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteOrder, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['Orders']);
      await queryClient.invalidateQueries([
        'dashboardCards',
        'Orders',
        'dashboardTwoYears',
        'dashboardDmographic',
        'dashboardYears',
        'dashboardAverage',
        'Orders',
      ]);
      notifySuccess('Order deleted successfully');
    },

    onError() {
      notifyError('Failed to delete order');
    },
  });
};
