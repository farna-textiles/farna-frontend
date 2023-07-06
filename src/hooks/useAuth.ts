// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { confirmEmail, signin, signup, verify } from '../api';
import { notifyError, notifySuccess } from '../lib/utils';

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(signup, {
    onSuccess: (data) => {
      navigate('/signin');
      notifySuccess('Congratulations! You have successfully signed up.');
      notifySuccess('Please check your email for further instructions.');

      // Invalidate and refetch something here if needed
      // queryClient.invalidateQueries('QUERY_KEY');
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation(signin, {
    onSuccess: (data) => {
      notifySuccess('Welcome back!');

      navigate('/');
      // Invalidate and refetch something here if needed
      // queryClient.invalidateQueries('QUERY_KEY');
    },
    onError: (error: any) => {
      notifyError(error.response.data.message);
    },
  });
};

export const useVerify = () => {
  const queryClient = useQueryClient();

  return useMutation(verify, {
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['userVerificationSuccessMessage'],
        'Account has been verified successfully.'
      );
      queryClient.removeQueries(['userVerificationErrorMessage']);
    },

    onError: (error: any) => {
      queryClient.setQueryData(
        ['userVerificationErrorMessage'],
        error.response.data.message
      );
      queryClient.removeQueries(['userVerificationSuccessMessage']);
    },
  });
};

export const useConfirm = () => {
  const queryClient = useQueryClient();

  return useMutation(confirmEmail, {
    onSuccess: () => {
      const successKey: QueryKey = ['confirmEmailSuccessMessage'];
      queryClient.setQueryData(successKey, 'Email confirmed successfully');
      queryClient.removeQueries(['confirmEmailErrorMessage']);
    },
    onError: (error: any) => {
      const errorKey: QueryKey = ['confirmEmailErrorMessage'];
      queryClient.setQueryData(errorKey, error.response.data.message);
      queryClient.removeQueries(['confirmEmailSuccessMessage']);
    },
  });
};
