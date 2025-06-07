import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createFilterSlice } from '@/store/slices/filter';
import { createSearchSlice } from '@/store/slices/search';
import { createMapSlice } from '@/store/slices/map';
import { createNoticeSlice } from '@/store/slices/notice';
import { createCafeSlice } from '@/store/slices/cafe';
import { createLoadingSlice } from '@/store/slices/loading';
import { createUserSlice } from './slices/user';
import { createCragSlice } from '@/store/slices/crag';
import { createManageSlice } from '@/store/slices/manage';

type StoreState = ReturnType<typeof createMapSlice> &
  ReturnType<typeof createFilterSlice> &
  ReturnType<typeof createSearchSlice> &
  ReturnType<typeof createNoticeSlice> &
  ReturnType<typeof createCafeSlice> &
  ReturnType<typeof createLoadingSlice> &
  ReturnType<typeof createUserSlice> &
  ReturnType<typeof createCragSlice> &
  ReturnType<typeof createManageSlice>;

export const useStore = create<StoreState>()(
  persist(
    (set, get, store) => ({
      ...createManageSlice(set, get, store),
      ...createCragSlice(set, get, store),
      ...createUserSlice(set, get, store),
      ...createLoadingSlice(set, get, store),
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
          selectCafeId,
          selectUserId,
          crewCount,
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
          selectCafeId,
          selectUserId,
          crewCount,
        };
      },
    }
  )
);
