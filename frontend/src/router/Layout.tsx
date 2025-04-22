import { Outlet } from 'react-router';

import { QueryParamProvider } from 'use-query-params';

import { ImageStory } from '@/components/ImageStory';

import { ReactRouter7Adapter } from '@/router';
import { QueryProvider } from '@/router/QueryProvider';

import { Box } from '@mui/material';
import { ScheduleStory } from '@/components/ScheduleStory';

export function Layout() {
  return (
    <Box sx={{ width: '100dvw', height: '100dvh' }}>
      <QueryProvider>
        <QueryParamProvider adapter={ReactRouter7Adapter}>
          <Outlet />

          <ImageStory imageType="interior" />
          <ScheduleStory />
        </QueryParamProvider>
      </QueryProvider>
    </Box>
  );
}
