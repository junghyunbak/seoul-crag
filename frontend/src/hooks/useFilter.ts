import { useCallback, useMemo } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { useQueryParam, BooleanParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { format, parse, isBefore, getDay } from 'date-fns';

import { daysOfWeek } from '@/components/WeeklyHoursSilder';

export function useFilter() {
  const [sheetRef] = useStore(useShallow((s) => [s.sheetRef]));
  const [isFilterSheetOpen] = useStore(useShallow((s) => [s.isFilterSheetOpen]));
  const [selectDate] = useStore(useShallow((s) => [s.selectDate]));

  const [enableShowerFilter, setEnableShowerFilter] = useQueryParam(QUERY_STRING.FILTER_SHOWER, BooleanParam);
  const [enableExceptionSettingFilter, setEnableExceptionSettingFilter] = useQueryParam(
    QUERY_STRING.FILTER_EXCEPTION_SETTING,
    BooleanParam
  );
  const [enableNewSettingFilter, setEnableNewSettingFilter] = useQueryParam(
    QUERY_STRING.FILTER_NEW_SETTING,
    BooleanParam
  );
  const [enableTodayRemove, setEnableTodayRemove] = useQueryParam(QUERY_STRING.FILTER_TODAY_REMOVE, BooleanParam);

  const todayIso = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);
  const expeditionDay = daysOfWeek[getDay(selectDate || new Date())];
  const expeditionDateYYYYMMDD = useMemo(
    () => (selectDate ? format(selectDate, 'yyyy-MM-dd') : todayIso),
    [todayIso, selectDate]
  );

  const showerFilter = useMemo(
    () =>
      enableShowerFilter
        ? (crag: Crag) => {
            return crag.imageTypes?.includes('shower') || false;
          }
        : () => {
            return true;
          },
    [enableShowerFilter]
  );

  const exceptionSettingFilter = useMemo(
    () =>
      enableExceptionSettingFilter
        ? (crag: Crag) => {
            return !(crag.futureSchedules || []).some(
              ({ type, date }) => type === 'setup' && format(date, 'yyyy-MM-dd') === expeditionDateYYYYMMDD
            );
          }
        : () => {
            return true;
          },
    [enableExceptionSettingFilter, expeditionDateYYYYMMDD]
  );

  const newSettingFilter = useMemo(
    () =>
      enableNewSettingFilter
        ? (crag: Crag) => {
            return (crag.futureSchedules || []).some(
              ({ type, date }) => type === 'new' && format(date, 'yyyy-MM-dd') === expeditionDateYYYYMMDD
            );
          }
        : () => {
            return true;
          },
    [enableNewSettingFilter, expeditionDateYYYYMMDD]
  );

  const todayRemoveFilter = useMemo(
    () =>
      enableTodayRemove
        ? (crag: Crag) =>
            (crag.futureSchedules || []).some(
              ({ type, date }) => type === 'remove' && format(date, 'yyyy-MM-dd') === expeditionDateYYYYMMDD
            )
        : () => true,
    [enableTodayRemove, expeditionDateYYYYMMDD]
  );

  const filterCount = useMemo(() => {
    return [
      enableShowerFilter,
      enableExceptionSettingFilter,
      enableNewSettingFilter,
      enableTodayRemove,
      selectDate !== null,
    ].reduce((acc, cur) => acc + (cur ? 1 : 0), 0);
  }, [enableShowerFilter, enableExceptionSettingFilter, enableNewSettingFilter, enableTodayRemove, selectDate]);

  const getCragIsFiltered = useCallback(
    (crag: Crag) => {
      let _isFiltered = true;

      if (enableShowerFilter) {
        _isFiltered &&= showerFilter(crag);
      }

      if (enableExceptionSettingFilter) {
        _isFiltered &&= exceptionSettingFilter(crag);
      }

      if (enableNewSettingFilter) {
        _isFiltered &&= newSettingFilter(crag);
      }

      if (enableTodayRemove) {
        _isFiltered &&= todayRemoveFilter(crag);
      }

      return _isFiltered;
    },
    [
      enableExceptionSettingFilter,
      enableNewSettingFilter,
      enableShowerFilter,
      enableTodayRemove,
      exceptionSettingFilter,
      newSettingFilter,
      showerFilter,
      todayRemoveFilter,
    ]
  );

  const getCragIsOff = useCallback(
    (crag: Crag) => {
      let _isOff = false;

      if (crag.futureSchedules) {
        _isOff = crag.futureSchedules.some((schedule) => {
          if (schedule.type !== 'closed') {
            return;
          }

          const iso = format(schedule.date, 'yyyy-MM-dd');

          return iso === expeditionDateYYYYMMDD;
        });
      }

      if (crag.openingHourOfWeek) {
        const todayOpeningHour = crag.openingHourOfWeek.find((openingHour) => openingHour.day == expeditionDay);

        if (todayOpeningHour) {
          if (todayOpeningHour.is_closed) {
            _isOff = true;
          } else {
            if (todayOpeningHour.close_time && todayOpeningHour.open_time) {
              const openTime = parse(todayOpeningHour.open_time, 'HH:mm:ss', new Date());
              const closeTime = parse(todayOpeningHour.close_time, 'HH:mm:ss', new Date());

              _isOff = !(isBefore(openTime, new Date()) && isBefore(new Date(), closeTime));
            }
          }
        }
      }

      return _isOff;
    },
    [expeditionDay, expeditionDateYYYYMMDD]
  );

  const getFilteredCragCount = useCallback(
    (crags: Crag[] | undefined | null) => {
      if (!crags) {
        return 0;
      }

      return crags
        .filter(showerFilter)
        .filter(exceptionSettingFilter)
        .filter(newSettingFilter)
        .filter(todayRemoveFilter).length;
    },
    [exceptionSettingFilter, newSettingFilter, showerFilter, todayRemoveFilter]
  );

  return {
    sheetRef,
    isFilterSheetOpen,

    filterCount,

    enableShowerFilter,
    enableExceptionSettingFilter,
    enableNewSettingFilter,
    enableTodayRemove,

    todayIso,

    selectDate,

    setEnableShowerFilter,
    setEnableExceptionSettingFilter,
    setEnableNewSettingFilter,
    setEnableTodayRemove,

    showerFilter,
    exceptionSettingFilter,
    newSettingFilter,

    getCragIsFiltered,
    getCragIsOff,
    getFilteredCragCount,
  };
}
