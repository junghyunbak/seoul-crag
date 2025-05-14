import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useModifyExp() {
  const [setExpDateTimeStr] = useStore(useShallow((s) => [s.setExpDateTimeStr]));
  const [setCurrentDate] = useStore(useShallow((s) => [s.setCurrentDate]));

  const updateExpDateTimeStr = useCallback(
    (dateTime: string | null) => {
      setExpDateTimeStr(dateTime);
    },
    [setExpDateTimeStr]
  );

  const updateCurrentDate = useCallback(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);

  return {
    updateExpDateTimeStr,
    updateCurrentDate,
  };
}
