import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createFilterSlice } from '@/store/slices/filter';

type StoreState = {
  isCragListModalOpen: boolean;
  setIsCragListModalOpen: (isOpen: boolean) => void;

  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map) => void;

  mapRef: React.RefObject<HTMLDivElement | null>;

  lastLat: number;
  setLastLat: (lat: number) => void;

  lastLng: number;
  setLastLng: (lng: number) => void;

  gpsLat: number;
  setGpsLat: (lat: number) => void;

  gpsLng: number;
  setGpsLng: (lng: number) => void;
} & ReturnType<typeof createFilterSlice>;

export const useStore = create<StoreState>()(
  persist(
    (set, get, store) => ({
      ...createFilterSlice(set, get, store),

      isCragListModalOpen: false,
      setIsCragListModalOpen(isOpen) {
        set(() => ({ isCragListModalOpen: isOpen }));
      },

      map: null,
      setMap(map) {
        set(() => ({ map }));
      },

      mapRef: { current: null },

      lastLat: -1,
      setLastLat(lat) {
        set(() => ({ lastLat: lat }));
      },

      lastLng: -1,
      setLastLng(lng) {
        set(() => ({ lastLng: lng }));
      },

      gpsLat: -1,
      setGpsLat(lat) {
        set(() => ({ gpsLat: lat }));
      },

      gpsLng: -1,
      setGpsLng(lng) {
        set(() => ({ gpsLng: lng }));
      },
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
        } = state;

        return {
          isOpenFilterSheet,
          isFilterNewSetting,
          isFilterNonSetting,
          isFilterShower,
          isFilterTodayRemove,
          lastLat,
          lastLng,
        };
      },
    }
  )
);
