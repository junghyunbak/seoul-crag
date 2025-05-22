import { type StateCreator } from 'zustand';

type UserSliceType = {
  selectUserId: string | null;
  setSelectUserId: (userId: string | null) => void;
};

export const createUserSlice: StateCreator<UserSliceType> = (set): UserSliceType => ({
  selectUserId: null,
  setSelectUserId(userId) {
    set(() => ({ selectUserId: userId }));
  },
});
