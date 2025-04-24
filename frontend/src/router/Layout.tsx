import { Outlet } from 'react-router';

import { QueryParamProvider } from 'use-query-params';

import { Box } from '@mui/material';

import { StoryImage } from '@/components/StoryImage';
import { StorySchedule } from '@/components/StorySchedule';
import { CragDetailModal } from '@/components/CragDetailModal';

import { ReactRouter7Adapter } from '@/router';
import { QueryProvider } from '@/router/QueryProvider';

export function Layout() {
  return (
    <Box sx={{ position: 'fixed', inset: 0 }}>
      <QueryProvider>
        <QueryParamProvider adapter={ReactRouter7Adapter}>
          <Outlet />

          <StoryImage imageType="interior" />
          <StorySchedule />
          <CragDetailModal />
        </QueryParamProvider>
      </QueryProvider>
    </Box>
  );
}
