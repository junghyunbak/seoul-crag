import { useCallback } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { DateService } from '@/utils/time';

import { differenceInDays, endOfDay, isAfter, isBefore, isWithinInterval, startOfDay } from 'date-fns';

import { DAY_STR_TO_INDEX } from '@/constants/time';

import { useTag, useSearch } from '@/hooks';

/**
 * 휴무           (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 단축 운영       (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 세팅           (dateTimeStr, yyyy-MM-dd'T'HH:mm:ss)
 * 요일별 운영 여부  (timeStr, HH:mm:ss)
 * 날짜           (date)
 */
export function useFilter(crag?: Crag, opts: { date?: Date; crewCount?: CrewCount } = {}) {
  const { date = new Date(), crewCount = 1 } = opts;

  const [filter] = useStore(useShallow((s) => [s.filter]));
  const { selectTagId } = useTag();
  const { searchKeyword } = useSearch();

  const getCragStats = useCallback(
    (crag: Crag | undefined, date: Date, searchKeyword = '', crewCount: CrewCount = 1) => {
      let isOpen = true;
      let isFiltered = true;

      let isRegularyClosed = false;
      let isTemporaryClosed = false;

      const isOuterWall = crag?.is_outer_wall || false;

      let isSetup = false;
      let isReduced = false;
      let isNewSetting = false;
      let isTodayRemove = false;

      let isSoonRemove = false;
      let isRecentlySetting = false;

      let isOperate = false;

      const schedules = (crag && crag.schedules) || [];
      const openingHourOfWeek = (crag && crag.openingHours) || [];
      const openingHour = openingHourOfWeek.find(({ day }) => DAY_STR_TO_INDEX[day] === date.getDay());
      const showerImages = ((crag && crag.images) || []).filter((image) => image.type === 'shower');

      if (openingHour?.is_closed) {
        isRegularyClosed = true;
      }

      const hasShower = showerImages.length > 0 || crag?.shower_url !== '';

      const current = new DateService(date);
      let open = new DateService(DateService.timeStrToDate(openingHour?.open_time || '', date));
      let close = new DateService(DateService.timeStrToDate(openingHour?.close_time || '', date));

      const originOpen = open;
      const originClose = close;

      let remainSetupDay = Infinity;
      let elapseSetupDay = Infinity;

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

          if (isBefore(startOfDay(date), _open.date)) {
            remainSetupDay = Math.min(remainSetupDay, differenceInDays(startOfDay(_open.date), startOfDay(date)));
          }

          if (isAfter(endOfDay(date), _close.date)) {
            elapseSetupDay = Math.min(elapseSetupDay, differenceInDays(startOfDay(date), startOfDay(_close.date)));
          }

          if (current.dateStr === _open.dateStr) {
            isTodayRemove = true;
          }

          if (current.dateStr === _close.dateStr) {
            isNewSetting = true;
          }
        }
      });

      let appliedGroupDiscount: GymDiscount | null = null;
      let appliedDailyDiscount: GymDiscount | null = null;

      const gymDiscounts = (crag && crag?.gymDiscounts) || [];

      for (const gymDiscount of gymDiscounts) {
        switch (gymDiscount.type) {
          case 'group': {
            if (gymDiscount.min_group_size > crewCount) {
              break;
            }

            if (!appliedGroupDiscount) {
              appliedGroupDiscount = gymDiscount;
              break;
            }

            if (appliedGroupDiscount.min_group_size < gymDiscount.min_group_size) {
              appliedGroupDiscount = gymDiscount;
            }

            break;
          }
          case 'time': {
            const { weekday, time_start, time_end } = gymDiscount;

            if (current.date.getDay() === weekday) {
              const start = DateService.timeStrToDate(time_start, date);
              const end = DateService.timeStrToDate(time_end, date);

              if (
                isWithinInterval(current.date, {
                  start,
                  end,
                })
              ) {
                appliedDailyDiscount = gymDiscount;
              }
            }

            break;
          }
          case 'event': {
            const { date, time_start, time_end } = gymDiscount;

            const start = DateService.dateTimeStrToDate(`${date}T${time_start}`);
            const end = DateService.dateTimeStrToDate(`${date}T${time_end}`);

            if (
              isWithinInterval(current.date, {
                start,
                end,
              })
            ) {
              appliedDailyDiscount = gymDiscount;
            }

            break;
          }
        }
      }

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
      isRecentlySetting = elapseSetupDay < 3;

      isOpen &&= isWithinInterval(current.date, {
        start: open.date,
        end: close.date,
      });

      if (!isOperate) {
        isOpen &&= !isTemporaryClosed;
        isOpen &&= !isRegularyClosed;
      }

      if (crag?.is_shut_down) {
        isFiltered &&= !crag.is_shut_down;
      }

      if (filter.isShower) {
        isFiltered &&= hasShower;
      }

      if (filter.isNonSetting) {
        isFiltered &&= !isSetup;
      }

      // [ ]: 3일 내 세팅으로 기능 변경됨에 따라 네이밍 수정 필요
      if (filter.isNewSetting) {
        isFiltered &&= isRecentlySetting;
      }

      if (filter.isOuterWall) {
        isFiltered &&= isOuterWall;
      }

      if (filter.isOpen) {
        isFiltered &&= isOpen;
      }

      // [ ]: 3일 내 탈거로 기능 변경됨에 따라 네이밍 수정 필요
      if (filter.isTodayRemove) {
        isFiltered &&= isSoonRemove;
      }

      if (filter.isSale) {
        isFiltered &&= appliedDailyDiscount !== null || appliedGroupDiscount !== null;
      }

      if (searchKeyword) {
        isFiltered &&=
          crag?.name.toLowerCase().includes(searchKeyword) ||
          crag?.short_name?.toLocaleLowerCase().includes(searchKeyword) ||
          false;
      }

      Object.entries(selectTagId).forEach(([, tagId]) => {
        if (!crag || !tagId) {
          return;
        }

        isFiltered &&= (crag.gymTags || []).some(({ tag: { id } }) => {
          return tagId === id;
        });
      });

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
        isRecentlySetting,
        remainSetupDay,
        elapseSetupDay,
        showerImages,
        originOpen,
        originClose,
        appliedGroupDiscount,
        appliedDailyDiscount,
      };
    },
    [filter, selectTagId]
  );

  const stats = getCragStats(crag, date, searchKeyword, crewCount);

  return {
    filter,
    ...stats,
    getCragStats,
  };
}

export function useFilterSheet() {
  const [isFilterBottomSheetOpen] = useStore(useShallow((s) => [s.isFilterBottomSheetOpen]));

  return { isFilterBottomSheetOpen };
}
