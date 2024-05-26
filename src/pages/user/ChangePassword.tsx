import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useChangePassword } from '../../hooks/useUser';
import { useNavigate } from 'react-router';
import { Loader } from '@mantine/core';

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .notOneOf(
      [Yup.ref('currentPassword')],
      'New password must not be the same as the current password'
    )
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  currentPassword: Yup.string().required('Current password is required'),
});

const ChangePassword = () => {
  const changePasswordMutation = useChangePassword();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      currentPassword: '',
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.password,
      });
      navigate('/');
    },
  });

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[80vh]">
      <div className="w-full p-6 bg-white rounded-lg shadow border md:mt-0 sm:max-w-md text-black mx-auto mt-40">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Change Password
          </h2>
        </div>
        <form
          className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
          onSubmit={formik.handleSubmit}
        >
          <div>
            <label
              htmlFor="currentPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 ${
                formik.touched.currentPassword && formik.errors.currentPassword
                  ? 'border-red-500'
                  : ''
              }`}
              placeholder="••••••••"
              required
              {...formik.getFieldProps('currentPassword')}
            />
            {formik.touched.currentPassword &&
              formik.errors.currentPassword && (
                <div className="text-red-500 mt-1">
                  {formik.errors.currentPassword}
                </div>
              )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 ${
                formik.touched.password && formik.errors.password
                  ? 'border-red-500'
                  : ''
              }`}
              placeholder="••••••••"
              required
              {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 mt-1">{formik.errors.password}</div>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 placeholder-gray-400 ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-500'
                  : ''
              }`}
              placeholder="••••••••"
              required
              {...formik.getFieldProps('confirmPassword')}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-red-500 mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>
          <button
            type="submit"
            disabled={changePasswordMutation.isLoading}
            className="relative w-full px-4 py-2 h-10 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150"
          >
            {changePasswordMutation.isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader color="white" />
              </div>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
