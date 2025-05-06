import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createFilterSlice } from '@/store/slices/filter';
import { createSearchSlice } from '@/store/slices/search';
import { createMapSlice } from '@/store/slices/map';

type StoreState = ReturnType<typeof createMapSlice> &
  ReturnType<typeof createFilterSlice> &
  ReturnType<typeof createSearchSlice>;

export const useStore = create<StoreState>()(
  persist(
    (set, get, store) => ({
      ...createFilterSlice(set, get, store),
      ...createSearchSlice(set, get, store),
      ...createMapSlice(set, get, store),
    }),
    {
      name: 'zustandStore',
      partialize(state) {
        const {
          isOpenFilterSheet,
          isFilterNewSetting,
          isFilterNonSetting,
          isFilterShower,
          isFilterTodayRemove,
          lastLat,
          lastLng,
          zoomLevel,
          isSearchOpen,
          searchSortOption,
          searchKeyword,
        } = state;

        return {
          isOpenFilterSheet,
          isFilterNewSetting,
          isFilterNonSetting,
          isFilterShower,
          isFilterTodayRemove,
          lastLat,
          lastLng,
          zoomLevel,
          isSearchOpen,
          searchSortOption,
          searchKeyword,
        };
      },
    }
  )
);
