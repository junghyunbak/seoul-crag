import { createBrowserRouter, useLocation, useNavigate } from 'react-router';

import { type PartialLocation, type QueryParamAdapterComponent } from 'use-query-params';

import { ErrorBoundary } from 'react-error-boundary';

import { Main, ManagePage, NotFound } from '@/pages';

import { Layout } from '@/router/Layout';

import { User } from '@/pages/manage/User';
import { Users } from '@/pages/manage/Users';
import { Crags } from '@/pages/manage/Crags';
import { Dashboard } from '@/pages/manage/Dashboard';
import { NewCrag } from '@/pages/manage/NewCrag';

// https://github.com/pbeshai/use-query-params/issues/295
export const ReactRouter7Adapter: QueryParamAdapterComponent = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return children({
    location,
    push: ({ search, state }: PartialLocation) => navigate({ search }, { state }),
    replace: ({ search, state }: PartialLocation) => navigate({ search }, { replace: true, state }),
  });
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />,
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
            <ManagePage />
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
    ],
  },
]);
