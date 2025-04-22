import { createBrowserRouter, useLocation, useNavigate } from 'react-router';

import { type PartialLocation, type QueryParamAdapterComponent } from 'use-query-params';

import { ErrorBoundary } from 'react-error-boundary';

import { Main, ManagePage, NotFound } from '@/pages';

import { Layout } from '@/router/Layout';

import { PATH } from '@/constants';

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
        path: PATH.MAIN_PAGE_PATH,
        element: <Main />,
      },
      {
        path: PATH.MANAGE_PAGE_PATH,
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
            path: PATH.MANAGE_PAGE_SUB_PATH_DASHBOARD,
            element: <Dashboard />,
          },
          {
            path: PATH.MANAGE_PAGE_SUB_PATH_USERS,
            element: <Users />,
          },
          {
            path: PATH.MANAGE_PAEG_SUB_PATH_NEW_CRAG,
            element: <NewCrag />,
          },
          {
            path: PATH.MANAGE_PAGE_SUB_PATH_CRAGS,
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
