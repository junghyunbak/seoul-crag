import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyCragList() {
  const [setIsCragListModalOpen] = useStore(useShallow((s) => [s.setIsCragListModalOpen]));

  const updateIsCragListModalOpen = useCallback(
    (isOpen: boolean) => {
      setIsCragListModalOpen(isOpen);
    },
    [setIsCragListModalOpen]
  );

  return {
    updateIsCragListModalOpen,
  };
}
