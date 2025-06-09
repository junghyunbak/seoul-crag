import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyConfirm() {
  const [setConfirmContext] = useStore(useShallow((s) => [s.setConfirmContext]));

  const fireConfirm = useCallback(
    (message: string, callback: () => void) => {
      setConfirmContext({ message, callback });
    },
    [setConfirmContext]
  );

  const closeConfirm = useCallback(() => {
    setConfirmContext(null);
  }, [setConfirmContext]);

  return { fireConfirm, closeConfirm };
}
