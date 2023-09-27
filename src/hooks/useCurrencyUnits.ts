
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
  getCurrencyUnits,
  createCurrencyUnit,
  updateCurrencyUnit,
  deleteCurrencyUnit,
} from '../api/currencyUnitApi';
import { notifyError, notifySuccess } from '../lib/utils';

export const useCurrencyUnits = () => {
  return useQuery(['currencyUnits'], getCurrencyUnits);
};



const updateCurrencyUnitMutation = async ({ id, ...updateData }) => {
  return updateCurrencyUnit(id, updateData);
};
export const useCreateCurrencyUnit = () => {
  const queryClient = useQueryClient();
  return useMutation(createCurrencyUnit, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['currencyUnits']);
      notifySuccess('Currency unit created successfully');
    },
    onError: () => {
      notifyError('Failed to create currency unit');
    },
  });
};


export const useUpdateCurrencyUnit = () => {
  const queryClient = useQueryClient();
  return useMutation(updateCurrencyUnitMutation, {
    onMutate: async (variables) => {
      const { id } = variables;
      await queryClient.invalidateQueries(['currencyUnits', id]);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['currencyUnits']);
      notifySuccess('Currency unit updated successfully');
    },
    onError: () => {
      notifyError('Failed to update currency unit');
    },
  });
};

export const useDeleteCurrencyUnit = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteCurrencyUnit, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['currencyUnits']);
      notifySuccess('Currency unit deleted successfully');
    },
    onError: () => {
      notifyError('Failed to delete currency unit');
    },
  });
};
