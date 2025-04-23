import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { urlService } from '@/utils';

import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      throwOnError(error) {
        const pathname = window.location.pathname;

        if (pathname.startsWith(urlService.getAbsolutePath('/manage'))) {
          if (error instanceof AxiosError && error.response?.status) {
            return error.response.status >= 400;
          }
        }

        return false;
      },
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
