import { QueryClientProvider, QueryClient, DefaultError } from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { urlService } from '@/utils';

import * as Sentry from '@sentry/react';
import { AxiosError } from 'axios';

function throwOnError(error: DefaultError) {
  console.error(error);

  if (!(error instanceof AxiosError && error.status === 401)) {
    Sentry.captureException(error);
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
      throwOnError,
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
