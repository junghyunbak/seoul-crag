import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useTag() {
  // TODO: modify 훅으로 분리
  const [selectTagIds, addSelectTagId, removeSelectTagId] = useStore(
    useShallow((s) => [s.selectTagIds, s.addSelectTagId, s.removeSelectTagId])
  );

  return { selectTagIds, addSelectTagId, removeSelectTagId };
}
