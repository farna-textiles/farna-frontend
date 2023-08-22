import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { notifyError, notifySuccess } from '../lib/utils';
import { ErrorResponse } from '../interfaces';
import { createOrder } from '../api';

const useCraeteOrder = () => {
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

export default useCraeteOrder;
