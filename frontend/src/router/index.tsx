import { lazy } from 'react';

import { createBrowserRouter, useLocation, useNavigate } from 'react-router';

import { type PartialLocation, type QueryParamAdapterComponent } from 'use-query-params';

import { Layout } from '@/router/Layout';

import { urlService } from '@/utils';

import { User } from '@/pages/manage/User';
import { Users } from '@/pages/manage/Users';
import { Crags } from '@/pages/manage/Crags';
import { Dashboard } from '@/pages/manage/Dashboard';
import { NewCrag } from '@/pages/manage/NewCrag';
import { Tags } from '@/pages/manage/Tags';
import { Contributions } from '@/pages/manage/Contributions';

const Main = lazy(() => import('@/pages/main'));
const ManagePage = lazy(() => import('@/pages/manage'));
const NotFound = lazy(() => import('@/pages/not-found'));
const Notices = lazy(() => import('@/pages/manage/Notices'));

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
        path: urlService.getAbsolutePath('/'),
        element: <Main />,
      },
      {
        path: urlService.getAbsolutePath('/manage'),
        element: <ManagePage />,
        children: [
          {
            index: true,
            element: <User />,
          },
          {
            path: urlService.getRelativePath('/manage/crags'),
            element: <Crags />,
          },
          {
            path: urlService.getRelativePath('/manage/dashborad'),
            element: <Dashboard />,
          },
          {
            path: urlService.getRelativePath('/manage/users'),
            element: <Users />,
          },
          {
            path: urlService.getRelativePath('/manage/new-crag'),
            element: <NewCrag />,
          },
          {
            path: urlService.getRelativePath('/manage/tags'),
            element: <Tags />,
          },
          {
            path: urlService.getRelativePath('/manage/notices'),
            element: <Notices />,
          },
          {
            path: urlService.getRelativePath('/manage/contributions'),
            element: <Contributions />,
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
