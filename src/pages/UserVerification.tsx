import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useVerify } from '../hooks/useAuth';

const UserVerification: React.FC = () => {
  const queryClient = useQueryClient();
  const verifyMutation = useVerify();
  const { verificationToken } = useParams();

  useEffect(() => {
    if (verificationToken) {
      verifyMutation.mutate({ verificationToken });
    }
  }, []);

  const successMessage = queryClient.getQueryData<string>([
    'userVerificationSuccessMessage',
  ]);
  const errorMessage = queryClient.getQueryData<string>([
    'userVerificationErrorMessage',
  ]);

  const handleRetry = () => {
    queryClient.removeQueries(['userVerificationSuccessMessage']);
    queryClient.removeQueries(['userVerificationErrorMessage']);
    if (verificationToken) verifyMutation.mutate({ verificationToken });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-3xl font-semibold text-indigo-600">
          User Verification
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
              An error occurred while verifying your account. Please try again
              or contact support.
            </p>
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Go Back
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
                  Please wait while we verify account.
                </p>
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
                </div>
              </>
            )}
            {successMessage && (
              <>
                <p className="text-gray-600">
                  Account has been verified successfully.
                </p>
                <div className="flex items-center justify-center">
                  <Link
                    to="/"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-lg duration-150"
                  >
                    Go Back
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

export default UserVerification;
