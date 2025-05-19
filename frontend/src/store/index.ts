import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createFilterSlice } from '@/store/slices/filter';
import { createSearchSlice } from '@/store/slices/search';
import { createMapSlice } from '@/store/slices/map';
import { createNoticeSlice } from '@/store/slices/notice';
import { createCafeSlice } from '@/store/slices/cafe';

type StoreState = ReturnType<typeof createMapSlice> &
  ReturnType<typeof createFilterSlice> &
  ReturnType<typeof createSearchSlice> &
  ReturnType<typeof createNoticeSlice> &
  ReturnType<typeof createCafeSlice>;

export const useStore = create<StoreState>()(
  persist(
    (set, get, store) => ({
      ...createCafeSlice(set, get, store),
      ...createNoticeSlice(set, get, store),
      ...createFilterSlice(set, get, store),
      ...createSearchSlice(set, get, store),
      ...createMapSlice(set, get, store),
    }),
    {
      name: 'zustandStore',
      partialize(state) {
        const {
          filter,
          lastLat,
          lastLng,
          zoomLevel,
          isSearchOpen,
          searchSortOption,
          searchKeyword,
          expDateTimeStr,
          enabledEdgeIndicator,
          enabledGpsIndicator,
          selectTagId,
          readNoticeIds,
          cafes,
          selectCafeId,
        } = state;

        return {
          filter,
          lastLat,
          lastLng,
          zoomLevel,
          isSearchOpen,
          searchSortOption,
          searchKeyword,
          expDateTimeStr,
          enabledEdgeIndicator,
          enabledGpsIndicator,
          selectTagId,
          readNoticeIds,
          cafes,
          selectCafeId,
        };
      },
    }
  )
);
