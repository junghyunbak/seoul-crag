import { useCallback, useMemo } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { format, parse, isBefore, getDay } from 'date-fns';

import { daysOfWeek } from '@/components/WeeklyHoursSilder';

export function useFilter() {
  const [isOpenFilterSheet] = useStore(useShallow((s) => [s.isOpenFilterSheet]));

  const [isFilterShower] = useStore(useShallow((s) => [s.isFilterShower]));
  const [isFilterNonSetting] = useStore(useShallow((s) => [s.isFilterNonSetting]));
  const [isFilterNewSetting] = useStore(useShallow((s) => [s.isFilterNewSetting]));
  const [isFilterTodayRemove] = useStore(useShallow((s) => [s.isFilterTodayRemove]));

  const [selectDate] = useStore(useShallow((s) => [s.selectDate]));

  const YYYYMMDDToday = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const YYYYMMDDExpedition = useMemo(
    () => (selectDate ? format(selectDate, 'yyyy-MM-dd') : YYYYMMDDToday),
    [YYYYMMDDToday, selectDate]
  );

  const DayExpedition = useMemo(() => daysOfWeek[getDay(selectDate || new Date())], [selectDate]);

  const filterShower = useMemo(
    () =>
      isFilterShower
        ? (crag: Crag) => {
            return crag.imageTypes?.includes('shower') || false;
          }
        : () => true,
    [isFilterShower]
  );

  const filterNonSetting = useMemo(
    () =>
      isFilterNonSetting
        ? (crag: Crag) => {
            return !(crag.futureSchedules || []).some(
              ({ type, date }) => type === 'setup' && format(date, 'yyyy-MM-dd') === YYYYMMDDExpedition
            );
          }
        : () => {
            return true;
          },
    [isFilterNonSetting, YYYYMMDDExpedition]
  );

  const filterNewSetting = useMemo(
    () =>
      isFilterNewSetting
        ? (crag: Crag) => {
            return (crag.futureSchedules || []).some(
              ({ type, date }) => type === 'new' && format(date, 'yyyy-MM-dd') === YYYYMMDDExpedition
            );
          }
        : () => {
            return true;
          },
    [isFilterNewSetting, YYYYMMDDExpedition]
  );

  const filterTodayRemove = useMemo(
    () =>
      isFilterTodayRemove
        ? (crag: Crag) =>
            (crag.futureSchedules || []).some(
              ({ type, date }) => type === 'remove' && format(date, 'yyyy-MM-dd') === YYYYMMDDExpedition
            )
        : () => true,
    [isFilterTodayRemove, YYYYMMDDExpedition]
  );

  const filterCount = useMemo(() => {
    return [isFilterShower, isFilterNonSetting, isFilterNewSetting, isFilterTodayRemove, selectDate !== null].reduce(
      (acc, cur) => acc + (cur ? 1 : 0),
      0
    );
  }, [isFilterNewSetting, isFilterNonSetting, isFilterShower, isFilterTodayRemove, selectDate]);

  const getCragIsFiltered = useCallback(
    (crag: Crag) => {
      let _isFiltered = true;

      if (isFilterShower) {
        _isFiltered &&= filterShower(crag);
      }

      if (isFilterNonSetting) {
        _isFiltered &&= filterNonSetting(crag);
      }

      if (isFilterNewSetting) {
        _isFiltered &&= filterNewSetting(crag);
      }

      if (isFilterTodayRemove) {
        _isFiltered &&= filterTodayRemove(crag);
      }

      return _isFiltered;
    },
    [
      filterNewSetting,
      filterNonSetting,
      filterShower,
      filterTodayRemove,
      isFilterNewSetting,
      isFilterNonSetting,
      isFilterShower,
      isFilterTodayRemove,
    ]
  );

  const getCragIsOff = useCallback(
    (crag: Crag) => {
      let _isOff = false;

      if (crag.futureSchedules) {
        _isOff = crag.futureSchedules.some(
          (schedule) => schedule.type === 'closed' && format(schedule.date, 'yyyy-MM-dd') === YYYYMMDDExpedition
        );
      }

      if (crag.openingHourOfWeek) {
        const todayOpeningHour = crag.openingHourOfWeek.find((openingHour) => openingHour.day == DayExpedition);

        if (todayOpeningHour) {
          if (todayOpeningHour.is_closed) {
            _isOff = true;
          } else {
            if (todayOpeningHour.close_time && todayOpeningHour.open_time) {
              /**
               * 원정 날짜만 고려하고, 시간은 현재를 기준으로 하고 있기 때문에 new Date() 사용
               */
              const openTime = parse(todayOpeningHour.open_time, 'HH:mm:ss', new Date());
              const closeTime = parse(todayOpeningHour.close_time, 'HH:mm:ss', new Date());

              _isOff = !(isBefore(openTime, new Date()) && isBefore(new Date(), closeTime));
            }
          }
        }
      }

      return _isOff;
    },
    [YYYYMMDDExpedition, DayExpedition]
  );

  const getFilteredCragCount = useCallback(
    (crags: Crag[] | undefined | null) => {
      if (!crags) {
        return 0;
      }

      return crags.filter(filterShower).filter(filterNonSetting).filter(filterNewSetting).filter(filterTodayRemove)
        .length;
    },
    [filterShower, filterNonSetting, filterNewSetting, filterTodayRemove]
  );

  return {
    isOpenFilterSheet,

    filterCount,

    isFilterNewSetting,
    isFilterNonSetting,
    isFilterShower,
    isFilterTodayRemove,

    YYYYMMDDExpedition,
    YYYYMMDDToday,

    selectDate,

    getCragIsFiltered,
    getCragIsOff,
    getFilteredCragCount,
  };
}
