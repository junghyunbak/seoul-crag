import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyCafe() {
  const [setCafes] = useStore(useShallow((s) => [s.setCafes]));
  const [setSelectCafeId] = useStore(useShallow((s) => [s.setSelectCafeId]));

  const updateCafes = useCallback(
    (cafes: Cafe[]) => {
      setCafes(cafes);
    },
    [setCafes]
  );

  const updateSelectCafeId = useCallback(
    (cafeId: string | null) => {
      setSelectCafeId(cafeId);
    },
    [setSelectCafeId]
  );

  return { updateCafes, updateSelectCafeId };
}
