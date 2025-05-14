import { type StateCreator } from 'zustand';

type FilterSliceType = {
  filter: Filter;
  setFilter: (fn: (filter: Filter) => Filter) => void;

  selectTagId: Partial<Record<Tag['type'], Tag['id']>>;
  updateSelectTag: (tag: Tag) => void;
  removeSelectTag: (tag: Tag) => void;

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

  selectTagId: {},
  updateSelectTag(tag) {
    const nextSelectTag = { ...get().selectTagId };

    nextSelectTag[tag.type] = tag.id;

    set(() => ({
      selectTagId: nextSelectTag,
    }));
  },
  removeSelectTag(tag) {
    const nextSelectTag = { ...get().selectTagId };

    if (!nextSelectTag[tag.type]) {
      return;
    }

    nextSelectTag[tag.type] = undefined;

    set(() => ({
      selectTagId: nextSelectTag,
    }));
  },
});
