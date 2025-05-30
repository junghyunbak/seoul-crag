import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useModifyFilter() {
  const [setFilter] = useStore(useShallow((s) => [s.setFilter]));

  const updateFilter = useCallback(
    (newFilter: Partial<Filter>) => {
      setFilter((filter) => ({
        ...filter,
        ...newFilter,
      }));
    },
    [setFilter]
  );

  return {
    updateFilter,
  };
}

export function useModifyFilterSheet() {
  const [setIsFilterBottonSheetOpen] = useStore(useShallow((s) => [s.setIsFilterBottonSheetOpen]));

  const updateIsFilterBottomSheetOpen = useCallback(
    (isOpen: boolean) => {
      setIsFilterBottonSheetOpen(isOpen);
    },
    [setIsFilterBottonSheetOpen]
  );

  return { updateIsFilterBottomSheetOpen };
}
