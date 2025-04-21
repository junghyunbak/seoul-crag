import { Outlet } from 'react-router';

import { QueryParamProvider } from 'use-query-params';

import { StoryPortal } from '@/components/portals/StoryPortal';

import { ReactRouter7Adapter } from '@/router';

import { Box } from '@mui/material';
import { MainServiceQueryProvider } from '@/router/QueryProvider';

export function Layout() {
  return (
    <Box sx={{ width: '100dvw', height: '100dvh' }}>
      <MainServiceQueryProvider>
        <QueryParamProvider adapter={ReactRouter7Adapter}>
          <Outlet />

          <StoryPortal imageType="interior" />
        </QueryParamProvider>
      </MainServiceQueryProvider>
    </Box>
  );
}
