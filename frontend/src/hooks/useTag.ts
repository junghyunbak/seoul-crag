import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useTag() {
  // TODO: modify 훅으로 분리
  const [selectTagId, updateSelectTag, removeSelectTag] = useStore(
    useShallow((s) => [s.selectTagId, s.updateSelectTag, s.removeSelectTag])
  );

  return { selectTagId, updateSelectTag, removeSelectTag };
}
