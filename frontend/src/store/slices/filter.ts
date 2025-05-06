import { type StateCreator } from 'zustand';

type FilterSliceType = {
  filter: Filter;
  setFilter: (fn: (filter: Filter) => Filter) => void;
};

export const createFilterSlice: StateCreator<FilterSliceType> = (set): FilterSliceType => ({
  filter: {
    date: null,
    isShower: false,
    isNonSetting: false,
    isNewSetting: false,
    isTodayRemove: false,
  },
  setFilter(fn) {
    set((state) => ({
      filter: fn(state.filter),
    }));
  },
});
