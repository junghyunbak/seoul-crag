import { useEffect } from 'react';

import { RouterProvider } from 'react-router';

import { router } from '@/router';

import { registerSW } from 'virtual:pwa-register';

import { useModifyConfirm } from '@/hooks';

function App() {
  const { fireConfirm } = useModifyConfirm();

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        fireConfirm('새 버전이 배포되었습니다. 새로고침할까요?', () => {
          let refreshing = false;

          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) {
              return;
            }

            refreshing = true;

            window.location.reload();
          });

          updateSW(true);
        });
      },
      onOfflineReady() {
        console.log('PWA 오프라인 사용 준비 완료!');
      },
    });

    return () => updateSW?.unregister?.();
  }, [fireConfirm]);

  return <RouterProvider router={router} />;
}

export default App;
