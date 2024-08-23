import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useConfirm } from '../hooks/useAuth';

const ConfirmEmail: React.FC = () => {
  const queryClient = useQueryClient();
  const confirmMutation = useConfirm();
  const { confirmationToken } = useParams();

  useEffect(() => {
    if (confirmationToken) {
      confirmMutation.mutate({ confirmationToken });
    }
  }, []);

  const successMessage = queryClient.getQueryData<string>([
    'confirmEmailSuccessMessage',
  ]);
  const errorMessage = queryClient.getQueryData<string>([
    'confirmEmailErrorMessage',
  ]);

  const handleRetry = () => {
    queryClient.removeQueries(['confirmEmailSuccessMessage']);
    queryClient.removeQueries(['confirmEmailErrorMessage']);
    if (confirmationToken) confirmMutation.mutate({ confirmationToken });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-semibold text-indigo-600">
          Email Confirmation
        </h1>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success:</strong> {successMessage}
          </div>
        )}
        {errorMessage ? (
          <>
            <p className="text-gray-600">
              An error occurred while confirming your email. Please try again or
              contact support.
            </p>
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Back
              </Link>
              <button
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg duration-150"
                type="button"
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          </>
        ) : (
          <>
            {!successMessage && (
              <>
                <p className="text-gray-600">
                  Please wait while we confirm your email.
                </p>
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
                </div>
              </>
            )}
            {successMessage && (
              <>
                <p className="text-gray-600">
                  Your email has been confirmed successfully. You can now login
                  to continue.
                </p>
                <div className="flex items-center justify-center">
                  <Link
                    to="/signin"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg duration-150"
                  >
                    Login
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmail;
