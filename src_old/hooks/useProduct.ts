// eslint-disable-next-line import/no-extraneous-dependencies
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { notifyError, notifySuccess } from '../lib/utils';
import { ErrorResponse, Product, ProductUpdateData } from '../interfaces';
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from '../api/productApi';

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['Products']);
      notifySuccess('Product deleted successfully');
    },

    onError() {
      notifyError('Failed to delete product');
    },
  });
};

export const useProduct = (productId: number, initialData?: Product) => {
  return useQuery(['product', productId], () => getProduct(productId), {
    initialData,
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useMutation<any, ErrorResponse, [number, ProductUpdateData]>(
    updateProduct,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['product', 'Products']);

        notifySuccess('Product updated successfully');
      },

      onError: async (error: ErrorResponse) => {
        await queryClient.invalidateQueries(['product']);

        notifyError(
          typeof error.message === 'object' ? error.message[0] : error.message
        );
      },
    }
  );
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation(createProduct, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['product']);
      navigate(`/products`);
      notifySuccess('Product created successfully');
    },

    onError: async (error: ErrorResponse) => {
      await queryClient.invalidateQueries(['product']);

      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};
