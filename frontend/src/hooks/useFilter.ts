import { useCallback, useMemo } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { isBefore, getDay } from 'date-fns';

import { DAYS_OF_WEEK } from '@/constants/time';

import { time } from '@/utils';

// TODO: 커스텀 훅 테스트코드 작성
export function useFilter() {
  const [isOpenFilterSheet] = useStore(useShallow((s) => [s.isOpenFilterSheet]));

  const [isFilterShower] = useStore(useShallow((s) => [s.isFilterShower]));
  const [isFilterNonSetting] = useStore(useShallow((s) => [s.isFilterNonSetting]));
  const [isFilterNewSetting] = useStore(useShallow((s) => [s.isFilterNewSetting]));
  const [isFilterTodayRemove] = useStore(useShallow((s) => [s.isFilterTodayRemove]));

  const [selectDate] = useStore(useShallow((s) => [s.selectDate]));

  const expeditionDate = useMemo(() => selectDate || new Date(), [selectDate]);
  const expeditionDay = getDay(expeditionDate);

  const passAllFilter = useCallback(() => true, []);

  const filterShower = useMemo(
    () =>
      isFilterShower
        ? (crag: Crag) => {
            if (!crag.imageTypes) {
              return false;
            }

            return crag.imageTypes.includes('shower');
          }
        : passAllFilter,
    [isFilterShower, passAllFilter]
  );

  const filterTodayRemove = useMemo(
    () =>
      isFilterTodayRemove
        ? (crag: Crag) =>
            (crag.futureSchedules || []).some(
              ({ open_date }) => time.dateTimeStrToDateStr(open_date) === time.dateToDateStr(expeditionDate)
            )
        : passAllFilter,
    [isFilterTodayRemove, passAllFilter, expeditionDate]
  );

  const filterNewSetting = useMemo(
    () =>
      isFilterNewSetting
        ? (crag: Crag) =>
            (crag.futureSchedules || []).some(
              ({ close_date }) => time.dateTimeStrToDateStr(close_date) === time.dateToDateStr(expeditionDate)
            )
        : passAllFilter,
    [isFilterNewSetting, passAllFilter, expeditionDate]
  );

  const filterNonSetting = useMemo(
    () =>
      isFilterNonSetting
        ? (crag: Crag) =>
            !(crag.futureSchedules || []).some(
              ({ type, open_date, close_date }) =>
                type === 'setup' &&
                isBefore(time.dateTimeStrToDate(open_date), expeditionDate) &&
                isBefore(expeditionDate, time.dateTimeStrToDate(close_date))
            )
        : () => {
            return true;
          },
    [isFilterNonSetting, expeditionDate]
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
      if (crag.openingHourOfWeek) {
        const todayOpeningHour = crag.openingHourOfWeek.find(
          (openingHour) => openingHour.day == DAYS_OF_WEEK[expeditionDay]
        );

        if (todayOpeningHour) {
          const { is_closed, open_time, close_time } = todayOpeningHour;

          if (is_closed) {
            return true;
          }

          if (
            !(
              open_time &&
              close_time &&
              isBefore(time.timeStrToDate(open_time, expeditionDate), expeditionDate) &&
              isBefore(expeditionDate, time.timeStrToDate(close_time, expeditionDate))
            )
          ) {
            return true;
          }
        }
      }

      if (
        (crag.futureSchedules || []).some(({ type, open_date, close_date }) => {
          if (time.dateToDateStr(expeditionDate) !== time.dateTimeStrToDateStr(open_date)) {
            return false;
          }

          if (type === 'closed') {
            const _isOff = time.dateTimeStrToDateStr(open_date) === time.dateToDateStr(expeditionDate);

            return _isOff;
          }

          if (type === 'reduced' && time.dateTimeStrToDateStr(open_date) === time.dateTimeStrToDateStr(close_date)) {
            const _isOff = !(
              isBefore(time.dateTimeStrToDate(open_date), expeditionDate) &&
              isBefore(expeditionDate, time.dateTimeStrToDate(close_date))
            );

            return _isOff;
          }

          return false;
        })
      ) {
        return true;
      }

      return false;
    },
    [expeditionDay, expeditionDate]
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

    selectDate,

    expeditionDate,

    getCragIsFiltered,
    getCragIsOff,
    getFilteredCragCount,
  };
}
