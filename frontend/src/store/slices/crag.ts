import { type StateCreator } from 'zustand';

type CragSliceType = {
  crags: Crag[];
  setCrags: (crags: Crag[]) => void;
};

export const createCragSlice: StateCreator<CragSliceType> = (set): CragSliceType => ({
  crags: [],
  setCrags: (crags) => {
    set(() => ({ crags }));
  },
});
