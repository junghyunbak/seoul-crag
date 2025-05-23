import { QueryClientProvider, QueryClient, DefaultError } from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { urlService } from '@/utils';

import * as Sentry from '@sentry/react';

function throwOnError(error: DefaultError) {
  console.error(error);

  Sentry.captureException(error);

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
