import { DAYS_OF_WEEK } from '@/constants/time';
import { useFilter } from './useFilter';
import { renderHook } from '@testing-library/react';
import { DateService } from '@/utils/time';

const mockCrag: Crag = {
  id: '',
  name: '',
  short_name: null,
  description: '',
  latitude: 0,
  longitude: 0,
  website_url: null,
  created_at: new Date(),
  updated_at: new Date(),
};

const dateStr = '2025-05-08';
const timeStr = '09:03:00';
const dateTimeStr = `${dateStr}T${timeStr}`;

const today = new DateService(dateTimeStr);

const todayCloseOpeningHour: OpeningHour = {
  id: '',
  day: DAYS_OF_WEEK[today.date.getDay()],
  open_time: today.timeStr,
  close_time: today.timeStr,
  is_closed: true,
};

const todayCloseSchedule: Schedule = {
  id: '',
  type: 'closed',
  open_date: today.dateTimeStr,
  close_date: today.dateTimeStr,
  created_at: new Date(),
};

const todayReduceSchedule: Schedule = {
  id: '',
  open_date: today.dateTimeStr,
  close_date: today.dateTimeStr,
  type: 'reduced',
  created_at: new Date(),
};

/**
 * 더 나은 네이밍을 위한 임시 변수
 */
const closeSchedule = todayCloseSchedule;
const closeOpeningHour = todayCloseOpeningHour;
const reduceSchedule = todayReduceSchedule;

describe('이미지 타입 존재여부 검사', () => {
  it('shower 타입의 이미지가 존재할 경우 hasShower가 true여야 한다.', () => {
    const { result } = renderHook(() => {
      const { hasShower } = useFilter({ ...mockCrag, imageTypes: ['shower'] });

      return { hasShower };
    });

    expect(result.current.hasShower).toBe(true);
  });

  it('shower 타입의 이미지가 존재하지 않을 경우 hasShower가 false여야 한다.', () => {
    const { result } = renderHook(() => {
      const { hasShower } = useFilter({ ...mockCrag, imageTypes: [] });

      return { hasShower };
    });

    expect(result.current.hasShower).toBe(false);
  });
});

describe('기본 운영 일정에 따른 상태 검사.', () => {
  it('현재 시간이 운영 일정 밖일 경우 isOff 상태가 true여야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [
            {
              ...todayCloseOpeningHour,
              open_time: '07:00:00',
              close_time: '08:00:00',
              is_closed: false,
            },
          ],
        },
        today.date
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(true);
  });

  it('현재 시간이 운영 일정 내일 경우 isOff 상태가 false여야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [
            {
              ...todayCloseOpeningHour,
              open_time: '07:00:00',
              close_time: '10:00:00',
              is_closed: false,
            },
          ],
        },
        today.date
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(false);
  });
});

describe('스케줄에 따른 암장 상태 검사', () => {
  it('오늘 날짜가 정기 휴무일 경우, isOff 상태가 true여야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [{ ...todayCloseOpeningHour, is_closed: true }],
        },
        today.date
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(true);
  });

  it('오늘 날짜가 임시 휴무일 경우, isOff 상태가 true여야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          futureSchedules: [todayCloseSchedule],
        },
        today.date
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(true);
  });

  it('오늘 날짜가 정기 휴무이면서 임시 휴무일 경우, isOff 상태가 true 이어야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [{ ...todayCloseOpeningHour, is_closed: true }],
          futureSchedules: [todayCloseSchedule],
        },
        today.date
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(true);
  });

  it('오늘 날짜가 정기 휴무이지만, 단축 일정이 존재할 경우 isOff 상태가 false이어야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [{ ...todayCloseOpeningHour, is_closed: true }],
          futureSchedules: [todayReduceSchedule],
        },
        today.date
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(false);
  });

  it('오늘 날짜가 임시 휴무이지만, 단축 일정이 존재할 경우 isOff 상태가 false이어야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          futureSchedules: [todayCloseSchedule, todayReduceSchedule],
        },
        today.date
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(false);
  });
});

describe('[필터 상태]', () => {});

describe('[오픈 상태]', () => {});

describe('[운영 상태]', () => {
  describe('단축 일정 존재할 경우', () => {
    describe('정기 휴무일 경우', () => {
      describe('임시 휴무일 경우', () => {
        it('운영하지 않는다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [closeOpeningHour],
                futureSchedules: [reduceSchedule, closeSchedule],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(false);
        });
      });

      describe('임시 휴무가 아닐 경우', () => {
        it('운영한다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [closeOpeningHour],
                futureSchedules: [reduceSchedule],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(true);
        });
      });
    });

    describe('정기 휴무가 아닐 경우', () => {
      describe('임시 휴무일 경우', () => {
        it('운영하지 않는다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [],
                futureSchedules: [reduceSchedule, closeSchedule],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(false);
        });
      });

      describe('임시 휴무가 아닐 경우', () => {
        it('운영한다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [],
                futureSchedules: [reduceSchedule],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(true);
        });
      });
    });
  });

  describe('단축 일정 존재하지 않을 경우', () => {
    describe('정기 휴무일 경우', () => {
      describe('임시 휴무일 경우', () => {
        it('운영하지 않는다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [closeOpeningHour],
                futureSchedules: [closeSchedule],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(false);
        });
      });

      describe('임시 휴무가 아닐 경우', () => {
        it('운영하지 않는다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [closeOpeningHour],
                futureSchedules: [],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(false);
        });
      });
    });

    describe('정기 휴무가 아닐 경우', () => {
      describe('임시 휴무일 경우', () => {
        it('운영하지 않는다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [],
                futureSchedules: [closeSchedule],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(false);
        });
      });

      describe('임시 휴무가 아닐 경우', () => {
        it('운영한다.', () => {
          const { result } = renderHook(() =>
            useFilter(
              {
                ...mockCrag,
                openingHourOfWeek: [],
                futureSchedules: [],
              },
              today.date
            )
          );

          expect(result.current.isOperate).toBe(true);
        });
      });
    });
  });
});
