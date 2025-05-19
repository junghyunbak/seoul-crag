import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyLoading() {
  const [setIsMarkerLoading] = useStore(useShallow((s) => [s.setIsMarkerLoading]));

  const updateIsMarkerLoading = useCallback(
    (isLoading: boolean) => {
      setIsMarkerLoading(isLoading);
    },
    [setIsMarkerLoading]
  );

  return {
    updateIsMarkerLoading,
  };
}
