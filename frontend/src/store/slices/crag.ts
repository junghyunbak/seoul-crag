import { type StateCreator } from 'zustand';

type CragSliceType = {
  crags: Crag[];
  setCrags: (crags: Crag[]) => void;

  tags: Tag[];
  setTags: (tags: Tag[]) => void;
};

export const createCragSlice: StateCreator<CragSliceType> = (set): CragSliceType => ({
  crags: [],
  setCrags: (crags) => {
    set(() => ({ crags }));
  },

  tags: [],
  setTags(tags) {
    set(() => ({ tags }));
  },
});
