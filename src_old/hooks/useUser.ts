import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ErrorResponse, UpdateUserRequest } from '../interfaces';
import { notifyError, notifySuccess } from '../lib/utils';
import { changePassword, deleteUser, updateUser } from '../api/userApi';
import { logout } from '../services/authService';

export const useUpdateUser = () => {
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

export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation(changePassword, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
      notifySuccess('Password updated successfully');
      logout()
    },

    onError: async (error: ErrorResponse) => {
      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteUser, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
      await queryClient.invalidateQueries(['Users']);

      notifySuccess('User deleted successfully');
    },

    onError: async (error: ErrorResponse) => {
      notifyError(
        typeof error.message === 'object' ? error.message[0] : error.message
      );
    },
  });
};
