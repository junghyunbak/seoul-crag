import { type StateCreator } from 'zustand';

type CafeSliceType = {
  cafes: Cafe[];
  setCafes: (cafes: Cafe[]) => void;

  selectCafeId: string;
  setSelectCafeId: (cafeId: string) => void;
};

export const createCafeSlice: StateCreator<CafeSliceType> = (set): CafeSliceType => ({
  cafes: [],
  setCafes: (cafes) => {
    set(() => ({ cafes }));
  },

  selectCafeId: '',
  setSelectCafeId(cafeId) {
    set(() => ({ selectCafeId: cafeId }));
  },
});
