import { useEffect } from 'react';

import { RouterProvider } from 'react-router';

import { router } from '@/router';

import { registerSW } from 'virtual:pwa-register';

function App() {
  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        const shouldReload = confirm('새 버전이 배포되었습니다. 새로고침할까요?');
        if (shouldReload) {
          updateSW(true); // skipWaiting() 실행 → 새 SW 활성화
          window.location.reload(); // 페이지 리로드
        }
      },
      onOfflineReady() {
        console.log('PWA 오프라인 사용 준비 완료!');
      },
    });

    return () => updateSW?.unregister?.();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
