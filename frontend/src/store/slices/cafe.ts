import { type StateCreator } from 'zustand';

type CafeSliceType = {
  cafes: Cafe[];
  setCafes: (cafes: Cafe[]) => void;
};

export const createCafeSlice: StateCreator<CafeSliceType> = (set): CafeSliceType => ({
  cafes: [],
  setCafes: (cafes) => {
    set(() => ({ cafes }));
  },
});
