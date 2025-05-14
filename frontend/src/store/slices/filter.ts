import { type StateCreator } from 'zustand';

type FilterSliceType = {
  filter: Filter;
  setFilter: (fn: (filter: Filter) => Filter) => void;

  selectTagIds: Tag['id'][];
  addSelectTagId: (tagId: string) => void;
  removeSelectTagId: (tagId: string) => void;

  /**
   * dateTime
   */
  expDateTimeStr: string | null;
  setExpDateTimeStr: (expDateTimeStr: string | null) => void;
};

export const createFilterSlice: StateCreator<FilterSliceType> = (set, get): FilterSliceType => ({
  filter: {
    isShower: false,
    isNonSetting: false,
    isNewSetting: false,
    isTodayRemove: false,
    isOuterWall: false,
    isOpen: false,
  },
  setFilter(fn) {
    set((state) => ({
      filter: fn(state.filter),
    }));
  },

  expDateTimeStr: null,
  setExpDateTimeStr(expDateTimeStr) {
    set(() => ({ expDateTimeStr }));
  },

  selectTagIds: [],
  addSelectTagId(tagId) {
    const nextTags = [...get().selectTagIds, tagId];

    set(() => ({
      selectTagIds: nextTags,
    }));
  },
  removeSelectTagId(tagId) {
    const nextTags = [...get().selectTagIds];

    const idx = nextTags.findIndex((_tagId) => _tagId === tagId);

    if (idx === -1) {
      return;
    }

    nextTags.splice(idx, 1);

    set(() => ({
      selectTagIds: nextTags,
    }));
  },
});
