import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { DateService } from '@/utils/time';
import { useMemo } from 'react';

export function useExp() {
  const [expDateTimeStr] = useStore(useShallow((s) => [s.expDateTimeStr]));
  const [currentDate] = useStore(useShallow((s) => [s.currentDate]));

  const isExpSelect = useMemo(() => expDateTimeStr !== null, [expDateTimeStr]);

  const exp = useMemo(() => new DateService(expDateTimeStr || currentDate), [expDateTimeStr, currentDate]);

  return { exp, isExpSelect, currentDate };
}
