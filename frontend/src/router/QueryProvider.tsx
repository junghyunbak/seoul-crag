import { QueryClientProvider, QueryClient, DefaultError } from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { urlService } from '@/utils';

import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

function throwOnError(error: DefaultError) {
  console.error(error);

  if (!(error instanceof AxiosError && error.status === 401)) {
    if (error instanceof AxiosError) {
      Sentry.captureException(error, {
        extra: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
          status: error.response?.status,
          responseData: error.response?.data,
          code: error.code,
        },
      });
    } else {
      Sentry.captureException(error);
    }
  }

  if (window.location.pathname.startsWith(urlService.getAbsolutePath('/manage'))) {
    return true;
  }

  return false;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      throwOnError,
      staleTime: Infinity,
    },
    mutations: {
      throwOnError,
    },
  },
});

export function QueryProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
