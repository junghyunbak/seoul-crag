import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { DateService } from '@/utils/time';

import { differenceInDays, isBefore, isWithinInterval } from 'date-fns';

import { DAY_STR_TO_INDEX } from '@/constants/time';

/**
 * 휴무           (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 단축 운영       (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 세팅           (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 요일별 운영 여부  (timeStr, HH:mm:ss)
 * 날짜           (date)
 */
export function useFilter(crag?: Crag, date = new Date()) {
  const [filter] = useStore(useShallow((s) => [s.filter]));

  const getCragStats = useCallback(
    (crag: Crag | undefined, date: Date) => {
      let isOpen = true;
      let isFiltered = true;

      let isRegularyClosed = false;
      let isTemporaryClosed = false;

      const isOuterWall = crag?.is_outer_wall || false;

      let isSetup = false;
      let isReduced = false;
      let isNewSetting = false;
      let isSoonRemove = false;
      let isTodayRemove = false;

      let isOperate = false;

      const imageTypes = (crag && crag.imageTypes) || [];
      const schedules = (crag && crag.futureSchedules) || [];
      const openingHourOfWeek = (crag && crag.openingHourOfWeek) || [];
      const openingHour = openingHourOfWeek.find(({ day }) => DAY_STR_TO_INDEX[day] === date.getDay());

      if (openingHour?.is_closed) {
        isRegularyClosed = true;
      }

      const hasShower = crag?.shower_url !== '' || imageTypes.some((type) => type === 'shower');

      const current = new DateService(date);
      let open = new DateService(DateService.timeStrToDate(openingHour?.open_time || '', date));
      let close = new DateService(DateService.timeStrToDate(openingHour?.close_time || '', date));

      let remainSetupDay = Infinity;

      /**
       * 스케줄로부터 다음 상태 계산
       *
       * - 임시 휴무
       * - 단축 운영
       * - 세팅 여부
       * - 오늘 탈거
       */
      schedules.forEach(({ type, open_date, close_date }) => {
        const _open = new DateService(open_date);
        const _close = new DateService(close_date);

        if (type === 'closed') {
          if (current.dateStr === _open.dateStr) {
            isTemporaryClosed = true;
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

          if (isBefore(date, _open.date)) {
            remainSetupDay = Math.min(remainSetupDay, differenceInDays(_open.date, date));
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
       * 구한 암장 상태로부터
       *
       * - 운영 여부
       * - 열림 여부 (and)
       * - 필터 여부 (and)
       *
       * 를 계산
       */
      isOperate = (() => {
        if (isTemporaryClosed) {
          return false;
        }

        if (isReduced) {
          return true;
        }

        return !isRegularyClosed;
      })();

      isSoonRemove = remainSetupDay < 3;

      isOpen &&= isWithinInterval(current.date, {
        start: open.date,
        end: close.date,
      });

      if (!isOperate) {
        isOpen &&= !isTemporaryClosed;
        isOpen &&= !isRegularyClosed;
      }

      if (filter.isShower) {
        isFiltered &&= hasShower;
      }

      if (filter.isNonSetting) {
        isFiltered &&= !isSetup;
      }

      if (filter.isNewSetting) {
        isFiltered &&= isNewSetting;
      }

      if (filter.isOuterWall) {
        isFiltered &&= isOuterWall;
      }

      // [ ]: 3일 내 탈거로 기능 변경됨에 따라 네이밍 수정 필요
      if (filter.isTodayRemove) {
        isFiltered &&= isSoonRemove;
      }

      return {
        isRegularyClosed,
        isTemporaryClosed,
        isFiltered,
        isReduced,
        isNewSetting,
        isSoonRemove,
        isTodayRemove,
        isOff: !isOpen,
        isOpen,
        hasShower,
        open,
        close,
        current,
        isOperate,
        isOuterWall,
        remainSetupDay,
      };
    },
    [filter]
  );

  const stats = getCragStats(crag, date);

  return {
    filter,
    ...stats,
    getCragStats,
  };
}
