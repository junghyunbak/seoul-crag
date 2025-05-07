import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useModifyExp() {
  const [setExpDateTimeStr] = useStore(useShallow((s) => [s.setExpDateTimeStr]));

  const updateExpDateTimeStr = useCallback(
    (dateTime: string | null) => {
      setExpDateTimeStr(dateTime);
    },
    [setExpDateTimeStr]
  );

  return {
    updateExpDateTimeStr,
  };
}
