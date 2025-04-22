import { Outlet } from 'react-router';

import { QueryParamProvider } from 'use-query-params';

import { Box } from '@mui/material';

import { StoryImage } from '@/components/StoryImage';
import { StorySchedule } from '@/components/StorySchedule';

import { ReactRouter7Adapter } from '@/router';
import { QueryProvider } from '@/router/QueryProvider';

export function Layout() {
  return (
    <Box sx={{ width: '100dvw', height: '100dvh' }}>
      <QueryProvider>
        <QueryParamProvider adapter={ReactRouter7Adapter}>
          <Outlet />

          <StoryImage imageType="interior" />
          <StorySchedule />
        </QueryParamProvider>
      </QueryProvider>
    </Box>
  );
}
