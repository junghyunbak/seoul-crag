import { Suspense } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { Outlet } from 'react-router';

import { QueryParamProvider } from 'use-query-params';

import { Box, Button, Typography } from '@mui/material';

import { StoryImage } from '@/components/StoryImage';
import { StorySchedule } from '@/components/StorySchedule';
import { CragDetailModal } from '@/components/CragDetailModal';

import { ReactRouter7Adapter } from '@/router';
import { QueryProvider } from '@/router/QueryProvider';

import { AxiosError } from 'axios';

import { useSuspenseQuery } from '@tanstack/react-query';

import { time } from '@/utils';

export function Layout() {
  return (
    <Box sx={{ position: 'fixed', inset: 0 }}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <QueryProvider>
          <QueryParamProvider adapter={ReactRouter7Adapter}>
            <Suspense fallback={<Splash />}>
              <LoadNaverMap>
                <Outlet />

                <StoryImage imageType="interior" />
                <StorySchedule />
                <CragDetailModal />
              </LoadNaverMap>
            </Suspense>
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

function Splash() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="img"
        src="/splash.png"
        sx={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px)' }}
      />
      <Box component="img" src="/splash.png" sx={{ position: 'absolute', height: '100%', objectFit: 'cover' }} />
    </Box>
  );
}

function LoadNaverMap({ children }: React.PropsWithChildren) {
  const { isLoading } = useSuspenseQuery({
    queryKey: ['navermap'],
    queryFn: async () => {
      const NCP_CLIENT_ID = 'xn1nppbjtp';

      await loadScript(`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NCP_CLIENT_ID}`);
      await loadScript('https://oapi.map.naver.com/openapi/v3/maps-gl.js');
      await loadScript('/markerClustering.js');

      await time.sleep(1000);

      return null;
    },
  });

  if (isLoading) {
    return;
  }

  return children;
}

function loadScript(src: string) {
  if (document.querySelector(`[src="${src}"]`)) {
    return null;
  }

  const script = document.createElement('script');

  script.src = src;
  script.type = 'text/javascript';

  return new Promise<void>((resolve) => {
    const handleScriptLoad = () => {
      resolve();
    };

    script.addEventListener('load', handleScriptLoad);

    document.body.appendChild(script);
  });
}
