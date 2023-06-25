/* eslint-disable import/no-extraneous-dependencies */
import React, { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import ErrorBoundaryRoute from './ErrorBoundaryRoute';

const SignIn = lazy(() => import('../pages/SignIn'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

export const AppRoutes: React.FC = () => {
  return useRoutes([
    {
      path: '/',
      element: <ErrorBoundaryRoute component={<SignIn />} />,
    },
    {
      path: '/signin',
      element: <ErrorBoundaryRoute component={<SignIn />} />,
    },
    {
      path: '/signUp',
      element: <ErrorBoundaryRoute component={<SignUp />} />,
    },
    {
      path: '/dashboard',
      element: (
        <AuthRoute path="/dashboard">
          <Dashboard />
        </AuthRoute>
      ),
    },
    {
      path: '/profile',
      element: (
        <AuthRoute path="/profile">
          <Profile />
        </AuthRoute>
      ),
    },
    {
      path: '*',
      element: <ErrorBoundaryRoute component={<PageNotFound />} />,
    },
  ]);
};

export default AppRoutes;
