import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEndUse } from '../api/endUserApi';
import { ErrorResponse } from '../interfaces';
import { notifyError, notifySuccess } from '../lib/utils';

const useCreateEndUse = () => {
  const queryClient = useQueryClient();
  return useMutation(createEndUse, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['endUses']);
      notifySuccess('EndUse added successfully');
    },

    onError: async (error: ErrorResponse) => {
      await queryClient.invalidateQueries(['endUses']);

      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};

export default useCreateEndUse;
