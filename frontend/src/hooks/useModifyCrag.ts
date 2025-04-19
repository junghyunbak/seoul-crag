import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useModifyCrag() {
  const [setCragMap] = useStore(useShallow((s) => [s.setCragMap]));
  const [setSelectCragId] = useStore(useShallow((s) => [s.setSelectCragId]));

  const updateCragMap = useCallback(
    (crags: Crag[]) => {
      const cragMap: Record<string, Crag> = {};

      crags.forEach((crag) => {
        cragMap[crag.id] = crag;
      });

      setCragMap(cragMap);
    },
    [setCragMap]
  );

  const updateSelectCragId = useCallback(
    (cragId: string | null) => {
      setSelectCragId(cragId);
    },
    [setSelectCragId]
  );

  return { updateCragMap, updateSelectCragId };
}
