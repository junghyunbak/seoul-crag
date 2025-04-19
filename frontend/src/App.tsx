import { createBrowserRouter, RouterProvider } from 'react-router';

import { QueryClientProvider, QueryClient, QueryCache, DefaultOptions } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import { Main, ManagePage, NotFound } from '@/pages';

import { AxiosError } from 'axios';

import './App.css';
import { User } from '@/pages/manage/User';
import { Users } from '@/pages/manage/Users';
import { Crags } from '@/pages/manage/Crags';
import { Dashboard } from '@/pages/manage/Dashboard';
import { NewCrag } from '@/pages/manage/NewCrag';

const defaultQueriesCommonOptions: DefaultOptions['queries'] = {
  refetchOnWindowFocus: false,
  retry: 0,
};

const mainServiceQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueriesCommonOptions,
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      console.log('에러', error);
    },
  }),
});

const manageServiceQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueriesCommonOptions,

      throwOnError(error) {
        if (error instanceof AxiosError && error.response?.status) {
          return error.response.status >= 400;
        }

        return false;
      },
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      console.log('일반 에러', error);
    },
  }),
});

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <QueryClientProvider client={mainServiceQueryClient}>
        <Main />
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      </QueryClientProvider>
    ),
  },
  {
    path: '/manage',
    element: (
      <ErrorBoundary
        fallback={
          <div>
            401<button onClick={() => (window.location.href = '/?menu=open')}>로그인</button>
          </div>
        }
      >
        <QueryClientProvider client={manageServiceQueryClient}>
          <ManagePage />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <User />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'new-crag',
        element: <NewCrag />,
      },
      {
        path: 'crags',
        element: <Crags />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
