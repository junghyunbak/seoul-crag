import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyCragList() {
  const [setIsCragListSheetOpen] = useStore(useShallow((s) => [s.setIsCragListSheetOpen]));

  const updateIsCragListSheetOpen = useCallback(
    (isOpen: boolean) => {
      setIsCragListSheetOpen(isOpen);
    },
    [setIsCragListSheetOpen]
  );

  return updateIsCragListSheetOpen;
}
