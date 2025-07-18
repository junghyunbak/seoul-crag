import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

import * as Sentry from '@sentry/react';

import { QueryParamProvider } from 'use-query-params';

import { Box, Button, Typography } from '@mui/material';

import { ReactRouter7Adapter } from '@/router';
import { QueryProvider } from '@/router/QueryProvider';

import { AxiosError } from 'axios';

import { useSuspenseQuery } from '@tanstack/react-query';

import { time } from '@/utils';

import { zIndex } from '@/styles';

export function Layout() {
  return (
    <Box sx={{ position: 'fixed', inset: 0 }}>
      <ErrorBoundary FallbackComponent={Fallback}>
        <QueryProvider>
          <QueryParamProvider adapter={ReactRouter7Adapter}>
            <Suspense fallback={<Splash />}>
              <LoadNaverMap>
                <Outlet />
              </LoadNaverMap>
            </Suspense>
          </QueryParamProvider>
        </QueryProvider>
      </ErrorBoundary>
    </Box>
  );
}

const Fallback = ({ error }: FallbackProps) => {
  Sentry.captureException(error);

  const errorCode = (() => {
    if (error instanceof AxiosError) {
      return error.status;
    }

    return -1;
  })();

  const errorMessage = (() => {
    switch (errorCode) {
      case 401:
        return '로그인이 필요한 기능입니다.';
      case 403:
        return '접근 권한이 없습니다.\n해당 암장의 관리자시면, jeong5728@gmail.com로 문의주세요.';
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
      <Typography variant="h1" fontWeight="bold">
        {errorCode}
      </Typography>
      <Typography variant="body1" component="pre" sx={{ whiteSpace: 'pre-wrap' }} textAlign="center">
        {errorMessage}
      </Typography>

      <Button variant="contained" onClick={() => (window.location.href = `/${errorCode === 401 ? '?menu=1' : ''}`)}>
        {errorCode === 401 ? '로그인' : '홈으로'}
      </Button>
    </Box>
  );
};

function Splash() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.splash,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fcf8ed',
      }}
    >
      <Box
        component="img"
        src="/splash.png"
        sx={{
          position: 'absolute',
          height: { xs: 'auto', sm: '100%' },
          width: { xs: '100%', sm: 'auto' },
          objectFit: 'cover',
        }}
      />
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
      await loadScript('/markerOverlapRecognizer.js');

      if (process.env.NODE_ENV === 'production') {
        await time.sleep(500);
      }

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
