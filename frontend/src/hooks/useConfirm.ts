import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useConfirm() {
  const [confirmContext] = useStore(useShallow((s) => [s.confirmContext]));

  return { confirmContext };
}
