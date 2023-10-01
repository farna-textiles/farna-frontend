/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/prefer-default-export */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCurrencyUnit,
  deleteCurrencyUnit,
  getAllCurrencyUnits,
  updateCurrencyUnit,
} from '../api/currencyUnitApi';
import { notifyError, notifySuccess } from '../lib/utils';
import { CurrencyUnit, ErrorResponse } from '../interfaces';

export const useCurrencyUnits = () => {
  return useQuery(['Currency Units'], () => {
    getAllCurrencyUnits();
  });
};

export const useCreateCurrencyUnit = () => {
  const queryClient = useQueryClient();
  return useMutation(createCurrencyUnit, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['Currency Units']);
      notifySuccess('Currency unit created successfully');
    },
    onError: () => {
      notifyError('Failed to create currency unit');
    },
  });
};

export const useUpdateCurrencyUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<any, ErrorResponse, [number, CurrencyUnit]>(
    updateCurrencyUnit,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['Currency Units']);

        notifySuccess('Currency unit updated successfully');
      },

      onError: async (error: ErrorResponse) => {
        await queryClient.invalidateQueries(['Currency Units']);

        notifyError(
          typeof error.message === 'object' ? error.message[0] : error.message
        );
      },
    }
  );
};

export const useDeleteCurrencyUnit = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCurrencyUnit, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['Currency Units']);
      notifySuccess('Currency unit deleted successfully');
    },

    onError(error: ErrorResponse) {
      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};
