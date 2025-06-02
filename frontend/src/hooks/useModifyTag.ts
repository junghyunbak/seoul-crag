import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyTag() {
  const [setTags] = useStore(useShallow((s) => [s.setTags]));
  const [updateSelectTag] = useStore(useShallow((s) => [s.updateSelectTag]));
  const [removeSelectTag] = useStore(useShallow((s) => [s.removeSelectTag]));

  const updateTags = useCallback(
    (tags: Tag[]) => {
      setTags(tags);
    },
    [setTags]
  );

  return {
    updateTags,
    updateSelectTag,
    removeSelectTag,
  };
}
