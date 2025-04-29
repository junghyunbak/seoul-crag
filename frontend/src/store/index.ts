import { SheetRef } from 'react-modal-sheet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StoreState = {
  sheetRef: React.RefObject<SheetRef | null>;

  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (isOpen: boolean) => void;

  isCragListModalOpen: boolean;
  setIsCragListModalOpen: (isOpen: boolean) => void;

  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map) => void;

  mapRef: React.RefObject<HTMLDivElement | null>;

  lastLat: number;
  setLastLat: (lat: number) => void;

  lastLng: number;
  setLastLng: (lng: number) => void;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      sheetRef: { current: null },

      isFilterSheetOpen: false,
      setIsFilterSheetOpen(isOpen) {
        set(() => ({ isFilterSheetOpen: isOpen }));
      },

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
    }),
    {
      name: 'zustandStore',
      partialize(state) {
        const { isFilterSheetOpen, lastLat, lastLng } = state;

        return { isFilterSheetOpen, lastLat, lastLng };
      },
    }
  )
);
