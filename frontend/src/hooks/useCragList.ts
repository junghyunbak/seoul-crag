import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useCragList() {
  const [isCragListModalOpen] = useStore(useShallow((s) => [s.isCragListModalOpen]));

  return { isCragListModalOpen };
}
