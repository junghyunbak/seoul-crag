import { QueryClientProvider, QueryClient, QueryCache, DefaultOptions } from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AxiosError } from 'axios';

const defaultQueriesCommonOptions: DefaultOptions['queries'] = {
  refetchOnWindowFocus: false,
  retry: 0,
};

const mainServiceQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueriesCommonOptions,
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      console.log('에러', error);
    },
  }),
});

const manageServiceQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      ...defaultQueriesCommonOptions,

      throwOnError(error) {
        if (error instanceof AxiosError && error.response?.status) {
          return error.response.status >= 400;
        }

        return false;
      },
    },
  },
  queryCache: new QueryCache({
    onError(error) {
      console.log('일반 에러', error);
    },
  }),
});

export function MainServiceQueryProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={mainServiceQueryClient}>
      {children}

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}

export function ManageServiceQueryProvider({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={manageServiceQueryClient}>
      {children}

      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
