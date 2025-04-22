import { SheetRef } from 'react-modal-sheet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type StoreState = {
  sheetRef: React.RefObject<SheetRef | null>;

  isFilterSheetOpen: boolean;
  setIsFilterSheetOpen: (isOpen: boolean) => void;

  isCragListSheetOpen: boolean;
  setIsCragListSheetOpen: (isOpen: boolean) => void;

  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map) => void;

  mapRef: React.RefObject<HTMLDivElement | null>;
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      sheetRef: { current: null },

      isFilterSheetOpen: true,
      setIsFilterSheetOpen(isOpen) {
        set(() => ({ isFilterSheetOpen: isOpen }));
      },

      isCragListSheetOpen: false,
      setIsCragListSheetOpen(isOpen) {
        set(() => ({ isCragListSheetOpen: isOpen }));
      },

      map: null,
      setMap(map) {
        set(() => ({ map }));
      },

      mapRef: { current: null },
    }),
    {
      name: 'zustandStore',
      partialize(state) {
        const { isFilterSheetOpen } = state;

        return { isFilterSheetOpen };
      },
    }
  )
);
