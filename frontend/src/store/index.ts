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

  gpsLatLng: { lat: number; lng: number };
  setGpsLatLng: (lat: number, lng: number) => void;

  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;
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

      gpsLatLng: {
        lat: -1,
        lng: -1,
      },
      setGpsLatLng(lat, lng) {
        set(() => ({ gpsLatLng: { lat, lng } }));
      },

      zoomLevel: 12,
      setZoomLevel(zoomLevel) {
        set(() => ({ zoomLevel }));
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
          zoomLevel,
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
        };
      },
    }
  )
);
