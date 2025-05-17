import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useNotice() {
  const [readNoticeIds] = useStore(useShallow((s) => [s.readNoticeIds]));
  const [isNoticeOpen] = useStore(useShallow((s) => [s.isNoticeOpen]));

  return { readNoticeIds, isNoticeOpen };
}
