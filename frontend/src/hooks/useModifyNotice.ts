import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyNotice() {
  const [setIsNoticeOpen] = useStore(useShallow((s) => [s.setIsNoticeOpen]));
  const [setReadNoticeIds] = useStore(useShallow((s) => [s.setReadNoticeIds]));

  const updateIsNoticeOpen = useCallback(
    (isOpen: boolean) => {
      setIsNoticeOpen(isOpen);
    },
    [setIsNoticeOpen]
  );

  const updateReadNoticeIds = useCallback(
    (noticeIds: string[]) => {
      setReadNoticeIds((prev) => {
        const readNoticeIdSet = new Set([...prev, ...noticeIds]);

        return Array.from(readNoticeIdSet);
      });
    },
    [setReadNoticeIds]
  );

  return { updateIsNoticeOpen, updateReadNoticeIds };
}
