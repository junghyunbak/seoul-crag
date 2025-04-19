import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyMap() {
  const [setMap] = useStore(useShallow((s) => [s.setMap]));

  const updateMap = useCallback(
    (map: naver.maps.Map) => {
      setMap(map);
    },
    [setMap]
  );

  return { updateMap };
}
