import { useCallback } from 'react';
import { useStore } from '../store';
import { useShallow } from 'zustand/shallow';

export function useModifyZoom() {
  const [setZoomLevel] = useStore(useShallow((s) => [s.setZoomLevel]));

  const updateZoomLevel = useCallback(
    (zoomLevel: number) => {
      setZoomLevel(zoomLevel);
    },
    [setZoomLevel]
  );

  return { updateZoomLevel };
}
