import { type StateCreator } from 'zustand';

import { DateService } from '@/utils/time';

type FilterSliceType = {
  filter: Filter;
  setFilter: (fn: (filter: Filter) => Filter) => void;

  /**
   * dateTime
   */
  expDateTimeStr: string | null;
  setExpDateTimeStr: (expDateTimeStr: string | null) => void;
};

export const createFilterSlice: StateCreator<FilterSliceType> = (set): FilterSliceType => ({
  filter: {
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

  expDateTimeStr: DateService.getCurrentDateTimeStr(),
  setExpDateTimeStr(expDateTimeStr) {
    set(() => ({ expDateTimeStr }));
  },
});
