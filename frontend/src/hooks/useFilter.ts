import { useMemo } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { isBefore, getDay } from 'date-fns';

import { DAYS_OF_WEEK } from '@/constants/time';

import { time } from '@/utils';

export function useFilter(crag: Crag | null = null) {
  const [filter] = useStore(useShallow((s) => [s.filter]));

  const selectDate = filter.date;

  const expeditionDate = useMemo(() => selectDate || new Date(), [selectDate]);
  const expeditionDay = getDay(expeditionDate);

  /**
   * true: 지도에 출력
   * false: 지도에 출력하지 않음
   */
  const isCragFilter = (() => {
    if (!crag) {
      return true;
    }

    if (filter.isShower && crag.imageTypes) {
      return crag.imageTypes.includes('shower');
    }

    if (filter.isTodayRemove && crag.futureSchedules) {
      return crag.futureSchedules.some(
        ({ type, open_date }) =>
          type === 'setup' && time.dateTimeStrToDateStr(open_date) === time.dateToDateStr(expeditionDate)
      );
    }

    if (filter.isNewSetting && crag.futureSchedules) {
      return crag.futureSchedules.some(
        ({ type, close_date }) =>
          type === 'setup' && time.dateTimeStrToDateStr(close_date) === time.dateToDateStr(expeditionDate)
      );
    }

    if (filter.isNonSetting && crag.futureSchedules) {
      return crag.futureSchedules.some(
        ({ type, open_date, close_date }) =>
          type === 'setup' &&
          isBefore(time.dateTimeStrToDate(open_date), expeditionDate) &&
          isBefore(expeditionDate, time.dateTimeStrToDate(close_date))
      );
    }

    return true;
  })();

  const isCragOff = (() => {
    if (!crag) {
      return true;
    }

    /**
     * 스케줄의 운영 정보 반영
     *
     * - 휴무일
     * - 단축 운영
     *
     * (⚠ 암장의 기본 운영 정보보다 먼저 적용되어야 함.)
     */
    for (const { type, open_date, close_date } of crag.futureSchedules || []) {
      // 오늘 스케줄이 아닌경우 패스
      if (time.dateToDateStr(expeditionDate) !== time.dateTimeStrToDateStr(open_date)) {
        continue;
      }

      if (type === 'closed') {
        return true;
      }

      if (type === 'reduced') {
        // 하루 이상의 범위일 경우 무시. 24시간 이상으로 운영하는 암장은 없음.
        if (time.dateTimeStrToDateStr(open_date) !== time.dateTimeStrToDateStr(close_date)) {
          continue;
        }

        // 단축 운영 시간 밖일 경우 off로 판단.
        // 당일 '단축 운영' 정보가 있다는 것은 기본 운영 정보를 무시해야 하므로 여기서 바로 반환.
        return !(
          isBefore(time.dateTimeStrToDate(open_date), expeditionDate) &&
          isBefore(expeditionDate, time.dateTimeStrToDate(close_date))
        );
      }
    }

    /**
     * 암장의 기본 운영 정보 반영
     */
    const todayOpeningHour = (crag?.openingHourOfWeek || []).find(
      (openingHour) => openingHour.day == DAYS_OF_WEEK[expeditionDay]
    );

    if (todayOpeningHour) {
      const { is_closed, open_time, close_time } = todayOpeningHour;

      if (is_closed) {
        return true;
      }

      if (
        !(
          isBefore(time.timeStrToDate(open_time, expeditionDate), expeditionDate) &&
          isBefore(expeditionDate, time.timeStrToDate(close_time, expeditionDate))
        )
      ) {
        return true;
      }
    }

    return false;
  })();

  return {
    filter,
    selectDate,
    expeditionDate,
    isCragFilter,
    isCragOff,
  };
}
