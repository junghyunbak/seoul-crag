import { type StateCreator } from 'zustand';

type NoticeSliceType = {
  readNoticeIds: string[];
  setReadNoticeIds: (fn: (readNoticeIds: string[]) => string[]) => void;

  isNoticeOpen: boolean;
  setIsNoticeOpen: (isNoticeOpen: boolean) => void;
};

export const createNoticeSlice: StateCreator<NoticeSliceType> = (set): NoticeSliceType => ({
  readNoticeIds: [],
  setReadNoticeIds(fn: (readNoticeIds: string[]) => string[]) {
    set((s) => ({ readNoticeIds: fn(s.readNoticeIds) }));
  },

  isNoticeOpen: false,
  setIsNoticeOpen(isNoticeOpen: boolean) {
    set(() => ({ isNoticeOpen }));
  },
});
