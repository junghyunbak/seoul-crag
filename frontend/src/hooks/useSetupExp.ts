import { useExp } from '@/hooks/useExp';
import { useModifyExp } from '@/hooks/useModifyExp';
import { useEffect } from 'react';

export function useSetupExp() {
  const { isExpSelect } = useExp();
  const { updateCurrentDate } = useModifyExp();

  useEffect(() => {
    const intervalTimer = setInterval(() => {
      updateCurrentDate();
    }, 1000 * 60);

    return function cleanup() {
      clearInterval(intervalTimer);
    };
  }, [isExpSelect, updateCurrentDate]);
}
