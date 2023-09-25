// eslint-disable-next-line import/no-extraneous-dependencies
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { confirmEmail, reactivation, signin, signup, verify } from '../api';
import { notifyError, notifySuccess } from '../lib/utils';
import { ErrorResponse } from '../interfaces';
import statusCode from '../constants/codes';

export const useSignUp = () => {
  const navigate = useNavigate();

  return useMutation(signup, {
    onSuccess: (data) => {
      navigate('/signin');
      notifySuccess(data.message);
    },
    onError: (error: ErrorResponse) => {
      notifyError(error.message);
    },
  });
};

export const useSignIn = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation(signin, {
    onSuccess: (data) => {
      notifySuccess('Welcome back!');
      const successKey: QueryKey = ['confirmEmailSuccessMessage'];
      queryClient.setQueryData(successKey, 'Email confirmed successfully');
      queryClient.setQueryData(['userInfo'], data.user);
      localStorage.setItem('userInfo', JSON.stringify(data.user));
      queryClient.removeQueries(['accountDisableError']);
      navigate('/');
    },
    onError: (error: ErrorResponse) => {
      if (
        error.statusCode === statusCode.BadRequest &&
        error.message === 'Account is disabled'
      ) {
        queryClient.setQueryData(['accountDisableError'], error.message);
      }
      notifyError(error.message);
    },
  });
};

export const useReactivation = () => {
  return useMutation(reactivation, {
    onSuccess: () => {
      notifySuccess('Re-activation request sent successfully');
    },
    onError: (error: ErrorResponse) => {
      notifyError(error.message);
    },
  });
};

export const useVerify = () => {
  const queryClient = useQueryClient();

  return useMutation(verify, {
    onSuccess: () => {
      queryClient.setQueryData(
        ['userVerificationSuccessMessage'],
        'Account has been verified successfully.'
      );
      queryClient.removeQueries(['userVerificationErrorMessage']);
    },

    onError: (error: ErrorResponse) => {
      queryClient.setQueryData(['userVerificationErrorMessage'], error.message);
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
    onError: (error: ErrorResponse) => {
      const errorKey: QueryKey = ['confirmEmailErrorMessage'];
      queryClient.setQueryData(errorKey, error.message);
      queryClient.removeQueries(['confirmEmailSuccessMessage']);
    },
  });
};
