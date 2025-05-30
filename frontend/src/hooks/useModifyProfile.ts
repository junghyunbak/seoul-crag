import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useModifyProfile() {
  const [setSelectUserId] = useStore(useShallow((s) => [s.setSelectUserId]));

  const updateSelectUserId = useCallback(
    (userId: string | null) => {
      setSelectUserId(userId);
    },
    [setSelectUserId]
  );

  return { updateSelectUserId };
}
