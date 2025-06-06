import { lazy } from 'react';

import { createBrowserRouter, useLocation, useNavigate } from 'react-router';

import { type PartialLocation, type QueryParamAdapterComponent } from 'use-query-params';

import { Layout } from '@/router/Layout';

import { urlService } from '@/utils';

const Main = lazy(() => import('@/components/pages/Main'));
const NotFound = lazy(() => import('@/components/pages/NotFound'));
const Manage = lazy(() => import('@/components/pages/Manage'));
const ManageCrags = lazy(() => import('@/components/pages/ManageCrags'));
const ManageCrag = lazy(() => import('@/components/pages/ManageCrag'));
const ManageDashboard = lazy(() => import('@/components/pages/ManageDashboard'));
const ManageContributions = lazy(() => import('@/components/pages/ManageContributions'));
const ManageTags = lazy(() => import('@/components/pages/ManageTags'));
const ManageCreateCrag = lazy(() => import('@/components/pages/ManageCreateCrag'));
const ManageUser = lazy(() => import('@/components/pages/ManageUser'));
const ManageUsers = lazy(() => import('@/components/pages/ManageUsers'));

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
        element: <Manage />,
        children: [
          {
            path: urlService.getRelativePath('/manage/user'),
            element: <ManageUser />,
          },
          {
            path: urlService.getRelativePath('/manage/crags'),
            element: <ManageCrags />,
            children: [
              {
                path: urlService.getRelativePath('/manage/crags/:id'),
                element: <ManageCrag />,
              },
            ],
          },
          {
            path: urlService.getRelativePath('/manage/dashborad'),
            element: <ManageDashboard />,
          },
          {
            path: urlService.getRelativePath('/manage/contributions'),
            element: <ManageContributions />,
          },
          {
            path: urlService.getRelativePath('/manage/tags'),
            element: <ManageTags />,
          },
          {
            path: urlService.getRelativePath('/manage/new-crag'),
            element: <ManageCreateCrag />,
          },
          {
            path: urlService.getRelativePath('/manage/users'),
            element: <ManageUsers />,
          },
          {
            path: urlService.getRelativePath('/manage/notices'),
            element: <Notices />,
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
