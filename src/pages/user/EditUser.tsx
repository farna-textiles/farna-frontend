/* eslint-disable jsx-a11y/label-has-associated-control */
import { ReactNode, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../api/userApi';
import { UpdateUserRequest } from '../../interfaces';
import { useUpdateUser } from '../../hooks/useUser';

const EditUser = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const updateUserMutation = useUpdateUser();

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters long')
      .max(20, 'Username cannot be more than 20 characters long'),
    role: Yup.string().required('Role is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    isActive: Yup.boolean().required('Account Status is required'),

    ...(showPasswordFields
      ? {
          password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .max(20, 'Password cannot be more than 20 characters long')
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
              'Password must contain at least 1 special character, 1 lowercase and 1 uppercase letter, and 1 number, and must be at least 8 characters long'
            ),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm Password is required'),
        }
      : {}),
  });
  const { data: userData } = useQuery(['user', userId], () =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    getUserById(+userId!)
  );

  const formik = useFormik({
    initialValues: {
      username: userData.username,
      role: userData.role,
      email: userData.email,
      password: '',
      confirmPassword: '',
      isActive: userData.isActive,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!userId) return;
      const updatedUserData: UpdateUserRequest = {
        id: +userId,
        username: values.username,
        role: values.role,
        email: values.email,
        isActive: values.isActive,
      };

      if (showPasswordFields) {
        updatedUserData.password = values.password;
      }

      await updateUserMutation.mutateAsync([+userId, updatedUserData]);

      navigate('/users');
    },
  });
  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);

    if (!showPasswordFields) {
      formik.setValues({
        ...formik.values,
        password: '',
        confirmPassword: '',
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-[80vh]">
      <div className="w-full p-6 bg-white rounded-lg shadow-md border text-gray-800 max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold leading-9 text-gray-900">
            Edit User
          </h2>
        </div>
        <form className="mt-4 space-y-4" onSubmit={formik.handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              disabled
              name="email"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              autoComplete="off"
              className="w-full px-4 py-2 rounded-md border text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500">
                {formik.errors.email as ReactNode}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              autoComplete="off"
              className="w-full px-4 py-2 rounded-md border text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
            {formik.touched.username && formik.errors.username && (
              <div className="text-red-500">
                {formik.errors.username as ReactNode}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-900"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.role}
              autoComplete="off"
              className="w-full px-4 py-2 rounded-md border text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-600"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <div className="text-red-500">
                {formik.errors.role as ReactNode}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-900">
              Account Status
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isActive"
                onChange={formik.handleChange}
                checked={formik.values.isActive}
                className="form-checkbox text-indigo-600 border-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
              />
              <span className="ml-2 text-gray-900">Activate Account</span>
            </label>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <button
                  type="button"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={togglePasswordFields}
                >
                  {showPasswordFields
                    ? 'Hide Password Fields'
                    : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
          {showPasswordFields && (
            <>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500">{formik.errors.password}</div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.confirmPassword}
                    autoComplete="new-password"
                    className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.confirmPassword &&
                    formik.errors.confirmPassword && (
                      <div className="text-red-500">
                        {formik.errors.confirmPassword}
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
          <div>
            <button
              type="submit"
              className={`w-full px-4 py-2 text-white font-medium rounded-lg transition duration-150 ${
                updateUserMutation.isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700'
              }`}
              disabled={updateUserMutation.isLoading}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
