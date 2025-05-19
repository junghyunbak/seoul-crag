import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyCafe() {
  const [setCafes] = useStore(useShallow((s) => [s.setCafes]));

  const updateCafes = useCallback(
    (cafes: Cafe[]) => {
      setCafes(cafes);
    },
    [setCafes]
  );

  return { updateCafes };
}
