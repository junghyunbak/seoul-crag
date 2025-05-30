import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useProfile() {
  const [selectUserId] = useStore(useShallow((s) => [s.selectUserId]));

  return { selectUserId };
}
