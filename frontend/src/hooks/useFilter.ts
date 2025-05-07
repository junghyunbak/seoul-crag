import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { format, isValid, isWithinInterval, parse } from 'date-fns';
import { useCallback } from 'react';

const dayStrToDay: Record<OpeningHourDayType, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

export class DateService {
  private _date: Date;

  constructor(date: Date | string | undefined | null) {
    if (date instanceof Date) {
      this._date = date;

      return;
    }

    if (typeof date === 'string') {
      const parseDate = new Date(date);

      this._date = isValid(parseDate) ? parseDate : new Date();

      return;
    }

    this._date = new Date();
  }

  get date() {
    return this._date;
  }

  get dateTimeStr() {
    return format(this._date, "yyyy-MM-dd'T'HH:mm:ss");
  }

  get dateStr() {
    return format(this._date, 'yyyy-MM-dd');
  }

  get timeStr() {
    return format(this._date, 'HH:mm:ss');
  }

  static dateTimeStrToDate(str: string) {
    return parse(str, "yyyy-MM-dd'T'HH:mm:ss", new Date());
  }

  static dateToDateTimeStr(date: Date) {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  }

  static timeToDate(str: string, baseDate: Date) {
    const parsedDate = parse(str, 'HH:mm:ss', baseDate);

    if (!isValid(parsedDate)) {
      return new Date();
    }

    return parsedDate;
  }
}

export function useExp() {
  const [expDateTimeStr] = useStore(useShallow((s) => [s.expDateTimeStr]));

  const isExpSelect = expDateTimeStr !== null;

  const exp = new DateService(expDateTimeStr);

  return { exp, isExpSelect };
}

export function useModifyExp() {
  const [setExpDateTimeStr] = useStore(useShallow((s) => [s.setExpDateTimeStr]));

  const updateExpDateTimeStr = useCallback(
    (dateTime: string | null) => {
      setExpDateTimeStr(dateTime);
    },
    [setExpDateTimeStr]
  );

  return {
    updateExpDateTimeStr,
  };
}

/**
 * 휴무           (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 단축 운영       (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 세팅           (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 요일별 운영 여부  (timeStr, HH:mm:ss)
 * 날짜           (date)
 */

// TEST: 해당 요일이 정기 휴무 날이지만 단축 운영 정보가 있다면, 운영 시간을 기준으로 isClosed가 계산되어야 한다.
export function useFilter(crag?: Crag, date = new Date()) {
  const [filter] = useStore(useShallow((s) => [s.filter]));

  const imageTypes = (crag && crag.imageTypes) || [];
  const schedules = (crag && crag.futureSchedules) || [];
  const openingHourOfWeek = (crag && crag.openingHourOfWeek) || [];
  const openingHour = openingHourOfWeek.find(({ day }) => dayStrToDay[day] === date.getDay());

  const current = new DateService(date);
  let open = new DateService(DateService.timeToDate(openingHour?.open_time || '', date));
  let close = new DateService(DateService.timeToDate(openingHour?.close_time || '', date));

  const hasShower = imageTypes.some((type) => type === 'shower');
  const isRegularyClosed = openingHour?.is_closed || false;

  let isTemporaryClosed = false;
  let isOff = false;
  let isSetup = false;
  let isFiltered = true;
  let isReduced = false;
  let isNewSetting = false;
  let isTodayRemove = false;

  /**
   * 1. 임시 휴무, 단축 운영, 세팅중 여부 계산
   */
  schedules.forEach(({ type, open_date, close_date }) => {
    const _open = new DateService(open_date);
    const _close = new DateService(close_date);

    if (type === 'closed') {
      if (current.dateStr === _open.dateStr) {
        isTemporaryClosed = true;
        isOff = true;
      }
    }

    if (type === 'reduced') {
      if (current.dateStr === _open.dateStr && current.dateStr === _close.dateStr) {
        isReduced = true;

        open = _open;
        close = _close;
      }
    }

    if (type === 'setup') {
      if (
        isWithinInterval(current.date, {
          start: _open.date,
          end: _close.date,
        })
      ) {
        isSetup = true;
      }

      if (current.dateStr === _open.dateStr) {
        isTodayRemove = true;
      }

      if (current.dateStr === _close.dateStr) {
        isNewSetting = true;
      }
    }
  });

  /**
   * 2. 최종 운영시간을 기반으로 현재 운영 여부(isClosed) 상태를 업데이트
   */
  if (
    !isWithinInterval(current.date, {
      start: open.date,
      end: close.date,
    })
  ) {
    isOff = true;
  }

  /**
   * 3. 구한 정보들을 기반으로, 필터 상태에 따라 필터 여부(isFiltered) 상태를 업데이트
   */
  if (filter.isShower) {
    isFiltered &&= hasShower;
  }

  if (filter.isNonSetting) {
    isFiltered &&= !isSetup;
  }

  if (filter.isNewSetting) {
    isFiltered &&= isNewSetting;
  }

  if (filter.isTodayRemove) {
    isFiltered &&= isTodayRemove;
  }

  return {
    filter,

    isRegularyClosed,
    isTemporaryClosed,

    isOff,
    isFiltered,
    isReduced,

    hasShower,

    open,
    close,

    current,
  };
}
