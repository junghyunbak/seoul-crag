import { Outlet } from 'react-router';

import { QueryParamProvider } from 'use-query-params';

import { Box, Button, Typography } from '@mui/material';

import { StoryImage } from '@/components/StoryImage';
import { StorySchedule } from '@/components/StorySchedule';
import { CragDetailModal } from '@/components/CragDetailModal';

import { ReactRouter7Adapter } from '@/router';
import { QueryProvider } from '@/router/QueryProvider';

import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { AxiosError } from 'axios';

export function Layout() {
  return (
    <Box sx={{ position: 'fixed', inset: 0 }}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <QueryProvider>
          <QueryParamProvider adapter={ReactRouter7Adapter}>
            <Outlet />

            <StoryImage imageType="interior" />
            <StorySchedule />
            <CragDetailModal />
          </QueryParamProvider>
        </QueryProvider>
      </ErrorBoundary>
    </Box>
  );
}

function Fallback({ error }: FallbackProps) {
  const errorCode = (() => {
    if (error instanceof AxiosError) {
      return error.status;
    }

    return -1;
  })();

  const errorMessage = (() => {
    switch (errorCode) {
      case 401:
        return '로그인이 필요합니다.';
      case 403:
        return '접근 권한이 없습니다.';
    }

    return '알 수 없는 에러가 발생했습니다.';
  })();

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h2">{errorMessage}</Typography>
      {errorCode === 403 && (
        <Typography variant="body1" textAlign="center">
          해당 암장의 관리자이신가요?
          <br />
          맞으시다면 이메일 <strong>jeong5728@gmail.com</strong> 으로 연락주세요.
        </Typography>
      )}
      <Button variant="contained" color="warning" onClick={() => (window.location.href = '/?menu=1')}>
        로그인 화면으로 이동
      </Button>
    </Box>
  );
}
