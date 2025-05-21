import { useEffect } from 'react';
import { useMarkerState } from '../_hooks/useMarkerState';
import { useZoom } from '@/hooks';
import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

interface MarkerZIndexProps {
  marker: MyMarker | null;
  isSelect: boolean;
}

/**
 * zoom이 매우 짧은 간격으로 변경됨에 따라
 * 마커 객체 내 useFilter가 매번 호출되어 성능 저하가 되는 문제를 해결하기 위해
 * zIndex값을 변경시키는 컴포넌트를 분리
 */
export function MarkerZIndex({ marker, isSelect }: MarkerZIndexProps) {
  const [recognizer] = useStore(useShallow((s) => [s.recognizer]));
  const { zoomLevel } = useZoom();
  const { zIndex } = useMarkerState({
    marker,
    zoomLevel,
    isSelect,
    recognizer,
  });

  useEffect(() => {
    if (!marker) {
      return;
    }

    marker.setZIndex(zIndex);
  }, [marker, zIndex]);

  return <div />;
}
