import { type StateCreator } from 'zustand';

type FilterSliceType = {
  isOpenFilterSheet: boolean;
  setIsOpenFilterSheet: (isOpen: boolean) => void;

  selectDate: Date | null;
  setSelectDate: (date: Date | null) => void;

  isFilterShower: boolean;
  setIsFilterShower: (isFilter: boolean) => void;

  isFilterNonSetting: boolean;
  setIsFilterNonSetting: (isFilter: boolean) => void;

  isFilterNewSetting: boolean;
  setIsFilterNewSetting: (isFilter: boolean) => void;

  isFilterTodayRemove: boolean;
  setIsFilterTodayRemove: (isFilter: boolean) => void;
};

export const createFilterSlice: StateCreator<FilterSliceType> = (set): FilterSliceType => ({
  isOpenFilterSheet: false,
  setIsOpenFilterSheet(isOpen) {
    set(() => ({ isOpenFilterSheet: isOpen }));
  },

  selectDate: null,
  setSelectDate(date) {
    set(() => ({ selectDate: date }));
  },

  isFilterShower: false,
  setIsFilterShower(isFilter) {
    set(() => ({ isFilterShower: isFilter }));
  },

  isFilterNonSetting: false,
  setIsFilterNonSetting(isFilter) {
    set(() => ({ isFilterNonSetting: isFilter }));
  },

  isFilterNewSetting: false,
  setIsFilterNewSetting(isFilter) {
    set(() => ({ isFilterNewSetting: isFilter }));
  },

  isFilterTodayRemove: false,
  setIsFilterTodayRemove(isFilter) {
    set(() => ({ isFilterTodayRemove: isFilter }));
  },
});
