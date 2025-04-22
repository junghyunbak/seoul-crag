import { Outlet } from 'react-router';

import { QueryParamProvider } from 'use-query-params';

import { StoryPortal } from '@/components/portals/StoryPortal';

import { ReactRouter7Adapter } from '@/router';
import { QueryProvider } from '@/router/QueryProvider';

import { Box } from '@mui/material';

export function Layout() {
  return (
    <Box sx={{ width: '100dvw', height: '100dvh' }}>
      <QueryProvider>
        <QueryParamProvider adapter={ReactRouter7Adapter}>
          <Outlet />

          <StoryPortal imageType="interior" />
        </QueryParamProvider>
      </QueryProvider>
    </Box>
  );
}
