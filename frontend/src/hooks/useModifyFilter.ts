import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyFilter() {
  const [setIsFilterSheetOpen] = useStore(useShallow((s) => [s.setIsFilterSheetOpen]));

  const updateIsFilterSheetOpen = useCallback(
    (isOpen: boolean) => {
      setIsFilterSheetOpen(isOpen);
    },
    [setIsFilterSheetOpen]
  );

  return {
    updateIsFilterSheetOpen,
  };
}
