import { type StateCreator } from 'zustand';

type CafeSliceType = {
  cafes: Cafe[];
  setCafes: (cafes: Cafe[]) => void;

  selectCafeId: string | null;
  setSelectCafeId: (cafeId: string | null) => void;
};

export const createCafeSlice: StateCreator<CafeSliceType> = (set): CafeSliceType => ({
  cafes: [],
  setCafes: (cafes) => {
    set(() => ({ cafes }));
  },

  selectCafeId: null,
  setSelectCafeId(cafeId) {
    set(() => ({ selectCafeId: cafeId }));
  },
});
