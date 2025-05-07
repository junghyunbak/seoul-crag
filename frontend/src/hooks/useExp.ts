import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { DateService } from '@/utils/time';

export function useExp() {
  const [expDateTimeStr] = useStore(useShallow((s) => [s.expDateTimeStr]));

  const isExpSelect = expDateTimeStr !== null;

  const exp = new DateService(expDateTimeStr);

  return { exp, isExpSelect };
}
