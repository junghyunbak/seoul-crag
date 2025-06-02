import { useEffect } from 'react';
import { useMap } from '@/hooks/useMap';
import { useModifyLoading } from '@/hooks/useModifyLoading';

export function useSetupMarkerLoading() {
  const { map } = useMap();

  const { updateIsMarkerLoading } = useModifyLoading();

  useEffect(() => {
    if (!map) {
      return;
    }

    const dragStartListener = map.addListener('dragstart', () => {
      updateIsMarkerLoading(true);
    });

    const zoomStartListener = map.addListener('zoomstart', () => {
      updateIsMarkerLoading(true);
    });

    const idleListener = map.addListener('idle', () => {
      updateIsMarkerLoading(false);
    });

    return function cleanup() {
      map.removeListener(dragStartListener);
      map.removeListener(zoomStartListener);
      map.removeListener(idleListener);
    };
  }, [map, updateIsMarkerLoading]);
}
