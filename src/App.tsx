/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import { AppRoutes } from './routes/AppRoutes';
import 'react-toastify/dist/ReactToastify.css';
import {getCurrencyUnits} from './api/currencyUnitApi';

const App: React.FC = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: true,
      },
    },
  });

  queryClient.prefetchQuery({
    queryKey: ['currencyUnits'],
    queryFn: getCurrencyUnits,
  });
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ToastContainer />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
