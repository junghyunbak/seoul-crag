import { AxiosInstance, AxiosError } from 'axios';

type RetryEntry = {
  request: () => Promise<unknown>;
  resolveOriginalResponse: (value: unknown) => void;
  rejectOriginalResponse: (reason?: unknown) => void;
};

export function setupTokenRefreshInterceptor({
  api,
  refreshApi,
  getRefreshUrl = () => '/auth/refresh',
}: {
  api: AxiosInstance;
  refreshApi: AxiosInstance;
  getRefreshUrl?: () => string;
}) {
  let isRefreshing = false;
  let retryQueue: RetryEntry[] = [];

  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        /**
         * `_retry` flag 설정
         *
         * 처음 요청이 실패하여 재시도 될 요청임을 표시한다.
         *
         * 표시하지 않으면 재귀적으로 intercept가 가로채어 토큰 refresh를 시도하게 된다.
         */
        originalRequest._retry = true;

        return new Promise((resolveOriginalResponse, rejectOriginalResponse) => {
          retryQueue.push({
            request: () => {
              return api(originalRequest);
            },
            resolveOriginalResponse,
            rejectOriginalResponse,
          });

          /**
           * `isRefreshing` flag 설정
           *
           * 요청이 여러개일 경우에도 한번만 refresh를 시도하기 위해 필요하다.
           */
          if (!isRefreshing) {
            isRefreshing = true;

            refreshApi
              .post(getRefreshUrl())
              .then(() => {
                retryQueue.forEach(({ request, resolveOriginalResponse, rejectOriginalResponse }) => {
                  request().then(resolveOriginalResponse).catch(rejectOriginalResponse);
                });
              })
              .catch((err) => {
                retryQueue.forEach(({ rejectOriginalResponse }) => rejectOriginalResponse(err));
              })
              .finally(() => {
                isRefreshing = false;
                retryQueue = [];
              });
          }
        });
      }

      return Promise.reject(error);
    }
  );
}
