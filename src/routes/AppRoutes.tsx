/* eslint-disable import/no-extraneous-dependencies */
import React, { lazy } from 'react';
import { useRoutes } from 'react-router-dom';
import AuthRoute from './AuthRoute';
import ErrorBoundaryRoute from './ErrorBoundaryRoute';
import UserVerification from '../pages/UserVerification';
import ConfirmEmail from '../pages/ConfirmEmail';

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
      path: '/signup',
      element: <ErrorBoundaryRoute component={<SignUp />} />,
    },
    {
      path: '/signup/:invitationToken',
      element: <ErrorBoundaryRoute component={<SignUp />} />,
    },
    {
      path: '/confirm-email/:confirmationToken',
      element: <ErrorBoundaryRoute component={<ConfirmEmail />} />,
    },
    {
      path: '/verify/:verificationToken',
      element: (
        <AuthRoute path="/verify/:verificationToken" redirect>
          <UserVerification />
        </AuthRoute>
      ),
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
      element: <PageNotFound />,
    },
  ]);
};

export default AppRoutes;
