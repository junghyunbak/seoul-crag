import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useCragList() {
  const [isCragListSheetOpen] = useStore(useShallow((s) => [s.isCragListSheetOpen]));

  return { isCragListSheetOpen };
}
