import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateUser, getUserById } from '../../api/userApi';
import { UpdateUserRequest } from '../../interfaces';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const [usersData, setUserData] = useState(null);

  const [showPasswordFields, setShowPasswordFields] = useState(false);

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
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
        }
      : {}),
  });
  const { data: userData } = useQuery(['user', id], () => getUserById(id));

  const updateUserMutation = useMutation((updatedUserData) =>
    updateUser(id, updatedUserData)
  );

  const formik = useFormik({
    initialValues: {
      username: '',
      role: '',
      email: 'huraira@gmail.com',
      password: '',
      confirmPassword: '',
      isActive: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedUserData: UpdateUserRequest = {
          id: values.id,
          username: values.username,
          role: values.role,
          email: values.email,
        };

        if (showPasswordFields) {
          updatedUserData.password = values.password;
          updatedUserData.confirmPassword = values.confirmPassword;
        }
        updatedUserData.isActive = values.isActive;
        const updatedUser = await updateUser(id, updatedUserData);

        await updateUserMutation.mutateAsync(updatedUserData);
        queryClient.invalidateQueries(['user', id]);

        console.log('User updated successfully', updatedUser);
        navigate('/users');
      } catch (error) {
        console.error('Error updating user', error);
      }
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

  useEffect(() => {
    if (userData) {
      formik.setValues({
        username: userData.username || '',
        role: userData.role || '',
        email: userData.email || '',
        isActive: userData.isActive || false,
      });
    }
  }, [userData]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div className="w-full p-6 bg-white rounded-lg shadow border md:mt-0 sm:max-w-md text-black">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Edit User
          </h2>
        </div>
        <form
          className="mt-4 space-y-2 lg:mt-5 md:space-y-5"
          onSubmit={formik.handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                disabled
                name="email"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                autoComplete="off"
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500">{formik.errors.email}</div>
              )}
            </div>
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
                autoComplete="off"
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500">{formik.errors.username}</div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Role
            </label>
            <div className="mt-2">
              <select
                id="role"
                name="role"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
                autoComplete="off"
                className="block w-full rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <div className="text-red-500">{formik.errors.role}</div>
              )}
            </div>
          </div>

          <label className="block text-sm font-medium leading-6 text-gray-900">
            Account Status
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isActive"
                onChange={formik.handleChange}
                checked={formik.values.isActive}
                className="form-checkbox text-indigo-600 border-indigo-600 rounded shadow-sm ring-1 ring-inset ring-indigo-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
              />
              <span className="ml-2 text-gray-900">Activate Account</span>
            </label>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={togglePasswordFields}
                >
                  {showPasswordFields
                    ? 'Hide Password Fields'
                    : 'Change Password'}
                </a>
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
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
