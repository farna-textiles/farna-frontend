import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse, UpdateUserRequest } from '../interfaces';
import { notifyError, notifySuccess } from '../lib/utils';
import { updateUser } from '../api/userApi';

const useUpdateUser = () => {
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useMutation<any, ErrorResponse, [number, UpdateUserRequest]>(
    updateUser,
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['Users']);
        await queryClient.invalidateQueries(['user']);

        notifySuccess('User updated successfully');
      },

      onError: async (error: ErrorResponse) => {
        await queryClient.invalidateQueries(['Users']);

        notifyError(
          typeof error.message === 'object' ? error.message[0] : error.message
        );
      },
    }
  );
};

export default useUpdateUser;
