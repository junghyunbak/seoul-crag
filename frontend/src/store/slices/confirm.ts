import { type StateCreator } from 'zustand';

type ConfirmContext = { message: string; callback: () => void };

type ConfirmSliceType = {
  confirmContext: ConfirmContext | null;
  setConfirmContext: (confirmContext: ConfirmContext | null) => void;
};

export const createConfirmSlice: StateCreator<ConfirmSliceType> = (set): ConfirmSliceType => ({
  confirmContext: null,
  setConfirmContext(confirmContext) {
    set(() => ({ confirmContext }));
  },
});
