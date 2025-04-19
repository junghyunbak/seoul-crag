import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useFilter() {
  const [sheetRef] = useStore(useShallow((s) => [s.sheetRef]));
  const [isFilterSheetOpen] = useStore(useShallow((s) => [s.isFilterSheetOpen]));

  return { sheetRef, isFilterSheetOpen };
}
