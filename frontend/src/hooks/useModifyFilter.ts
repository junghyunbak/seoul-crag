import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyFilter() {
  const [setIsFilterSheetOpen] = useStore(useShallow((s) => [s.setIsFilterSheetOpen]));
  const [setSelectDate] = useStore(useShallow((s) => [s.setSelectDate]));

  const updateIsFilterSheetOpen = useCallback(
    (isOpen: boolean) => {
      setIsFilterSheetOpen(isOpen);
    },
    [setIsFilterSheetOpen]
  );

  const updateSelectDate = useCallback(
    (date: Date | null) => {
      setSelectDate(date);
    },
    [setSelectDate]
  );

  return {
    updateIsFilterSheetOpen,
    updateSelectDate,
  };
}
