import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useModifyFilter() {
  const [setIsOpenFilterSheet] = useStore(useShallow((s) => [s.setIsOpenFilterSheet]));

  const [setSelectDate] = useStore(useShallow((s) => [s.setSelectDate]));

  const [setIsFilterShower] = useStore(useShallow((s) => [s.setIsFilterShower]));
  const [setIsFilterNewSetting] = useStore(useShallow((s) => [s.setIsFilterNewSetting]));
  const [setIsFilterNonSetting] = useStore(useShallow((s) => [s.setIsFilterNonSetting]));
  const [setIsFilterTodayRemove] = useStore(useShallow((s) => [s.setIsFilterTodayRemove]));

  const updateIsFilterSheetOpen = useCallback(
    (isOpen: boolean) => {
      setIsOpenFilterSheet(isOpen);
    },
    [setIsOpenFilterSheet]
  );

  const updateSelectDate = useCallback(
    (date: Date | null) => {
      setSelectDate(date);
    },
    [setSelectDate]
  );

  const updateIsFilterShower = useCallback(
    (isFilter: boolean) => {
      setIsFilterShower(isFilter);
    },
    [setIsFilterShower]
  );

  const updateIsFilterNonSetting = useCallback(
    (isFilter: boolean) => {
      setIsFilterNonSetting(isFilter);
    },
    [setIsFilterNonSetting]
  );

  const updateIsFilterNewSetting = useCallback(
    (isFilter: boolean) => {
      setIsFilterNewSetting(isFilter);
    },
    [setIsFilterNewSetting]
  );

  const updateIsFilterTodayRemove = useCallback(
    (isFilter: boolean) => {
      setIsFilterTodayRemove(isFilter);
    },
    [setIsFilterTodayRemove]
  );

  return {
    updateIsFilterSheetOpen,
    updateSelectDate,
    updateIsFilterShower,
    updateIsFilterNonSetting,
    updateIsFilterNewSetting,
    updateIsFilterTodayRemove,
  };
}
