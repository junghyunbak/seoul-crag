import { useConfirm } from '@/hooks';
import { useEffect } from 'react';

export function ConfirmModal() {
  const { confirmContext } = useConfirm();

  useEffect(() => {
    if (!confirmContext) {
      return;
    }

    const confirm = window.confirm(confirmContext.message);

    if (confirm) {
      confirmContext.callback();
    }
  }, [confirmContext]);

  // [ ]: custom ui confirm으로 대체
  return null;
}
