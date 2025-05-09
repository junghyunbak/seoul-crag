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

const openOpeningHour: OpeningHour = {
  id: '',
  day: DAYS_OF_WEEK[today.date.getDay()],
  open_time: today.timeStr,
  close_time: today.timeStr,
  is_closed: false,
};

const closeOpeningHour: OpeningHour = {
  id: '',
  day: DAYS_OF_WEEK[today.date.getDay()],
  open_time: today.timeStr,
  close_time: today.timeStr,
  is_closed: true,
};

const closeSchedule: Schedule = {
  id: '',
  type: 'closed',
  open_date: today.dateTimeStr,
  close_date: today.dateTimeStr,
  created_at: new Date(),
};

const reduceSchedule: Schedule = {
  id: '',
  open_date: today.dateTimeStr,
  close_date: today.dateTimeStr,
  type: 'reduced',
  created_at: new Date(),
};

describe('[이미지 상태]', () => {
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

describe('[오픈 상태]', () => {
  it('현재 시간이 일정 밖일 경우, 닫힘 상태이어야 한다.', () => {
    const { result } = renderHook(() =>
      useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [
            {
              ...openOpeningHour,
              open_time: '07:00:00',
              close_time: '08:00:00',
            },
          ],
        },
        today.date
      )
    );

    expect(result.current.isOff).toBe(true);
  });

  it('현재 시간이 일정 안일 경우, 열림 상태이어야 한다.', () => {
    const { result } = renderHook(() =>
      useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [
            {
              ...openOpeningHour,
              open_time: '07:00:00',
              close_time: '10:00:00',
            },
          ],
        },
        today.date
      )
    );

    expect(result.current.isOff).toBe(false);
  });

  describe('정기 휴무일 경우', () => {
    it('닫힘 상태이어야 한다.', () => {
      const { result } = renderHook(() => {
        const { isOff } = useFilter(
          {
            ...mockCrag,
            openingHourOfWeek: [closeOpeningHour],
            futureSchedules: [],
          },
          today.date
        );

        return { isOff };
      });

      expect(result.current.isOff).toBe(true);
    });

    describe('단축 일정이 존재할 경우', () => {
      it('열림 상태이어야 한다.', () => {
        const { result } = renderHook(() => {
          const { isOff } = useFilter(
            {
              ...mockCrag,
              openingHourOfWeek: [closeOpeningHour],
              futureSchedules: [reduceSchedule],
            },
            today.date
          );

          return { isOff };
        });

        expect(result.current.isOff).toBe(false);
      });
    });
  });

  describe('임시 휴무일 경우', () => {
    it('닫힘 상태이어야 한다.', () => {
      const { result } = renderHook(() => {
        const { isOff } = useFilter(
          {
            ...mockCrag,
            openingHourOfWeek: [],
            futureSchedules: [closeSchedule],
          },
          today.date
        );

        return { isOff };
      });

      expect(result.current.isOff).toBe(true);
    });

    describe('단축 일정이 존재할 경우', () => {
      it('닫힘 상태이어야 한다.', () => {
        const { result } = renderHook(() => {
          const { isOff } = useFilter(
            {
              ...mockCrag,
              openingHourOfWeek: [],
              futureSchedules: [closeSchedule, reduceSchedule],
            },
            today.date
          );

          return { isOff };
        });

        expect(result.current.isOff).toBe(true);
      });
    });
  });

  describe('정기 휴무 & 임시 휴무일 경우', () => {
    it('닫힘 상태이어야 한다.', () => {
      const { result } = renderHook(() => {
        const { isOff } = useFilter(
          {
            ...mockCrag,
            openingHourOfWeek: [closeOpeningHour],
            futureSchedules: [closeSchedule],
          },
          today.date
        );

        return { isOff };
      });

      expect(result.current.isOff).toBe(true);
    });
  });
});

describe('[필터 상태]', () => {});
