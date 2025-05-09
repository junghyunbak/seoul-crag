import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { DateService } from '@/utils/time';
import { useMemo } from 'react';

export function useExp() {
  const [expDateTimeStr] = useStore(useShallow((s) => [s.expDateTimeStr]));

  const isExpSelect = useMemo(() => expDateTimeStr !== null, [expDateTimeStr]);
  const exp = useMemo(() => new DateService(expDateTimeStr || new Date()), [expDateTimeStr]);

  return { exp, isExpSelect };
}
