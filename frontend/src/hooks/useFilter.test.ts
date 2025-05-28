import { DAYS_OF_WEEK } from '@/constants/time';
import { useFilter } from './useFilter';
import { renderHook } from '@testing-library/react';
import { DateService } from '@/utils/time';
import { addDays, addHours, subDays, subHours } from 'date-fns';

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
  is_outer_wall: false,
  shower_url: '',
  gymUserContributions: [],
  thumbnail_url: null,
  area: null,
  images: [],
  schedules: [],
  openingHours: [],
  gymTags: [],
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
  is_all_day: false,
};

const reduceSchedule: Schedule = {
  id: '',
  open_date: today.dateTimeStr,
  close_date: today.dateTimeStr,
  type: 'reduced',
  created_at: new Date(),
  is_all_day: false,
};

describe('[이미지 상태]', () => {
  it('shower_url 값이 존재할 경우, hasShower가 true여야 한다.', () => {
    const { result } = renderHook(() => {
      const { hasShower } = useFilter({ ...mockCrag, shower_url: 'https://...' });

      return { hasShower };
    });

    expect(result.current.hasShower).toBe(true);
  });

  it('shower_url 값이 빈 문자열일 경우, hasShower가 false여야 한다.', () => {
    const { result } = renderHook(() => {
      const { hasShower } = useFilter({ ...mockCrag, shower_url: '' });

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
                openingHours: [closeOpeningHour],
                schedules: [reduceSchedule, closeSchedule],
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
                openingHours: [closeOpeningHour],
                schedules: [reduceSchedule],
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
                openingHours: [],
                schedules: [reduceSchedule, closeSchedule],
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
                openingHours: [],
                schedules: [reduceSchedule],
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
                openingHours: [closeOpeningHour],
                schedules: [closeSchedule],
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
                openingHours: [closeOpeningHour],
                schedules: [],
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
                openingHours: [],
                schedules: [closeSchedule],
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
                openingHours: [],
                schedules: [],
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
          openingHours: [
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
          openingHours: [
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
            openingHours: [closeOpeningHour],
            schedules: [],
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
              openingHours: [closeOpeningHour],
              schedules: [reduceSchedule],
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
            openingHours: [],
            schedules: [closeSchedule],
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
              openingHours: [],
              schedules: [closeSchedule, reduceSchedule],
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
            openingHours: [closeOpeningHour],
            schedules: [closeSchedule],
          },
          today.date
        );

        return { isOff };
      });

      expect(result.current.isOff).toBe(true);
    });
  });
});

const oneHourSoon = new DateService(subHours(today.date, 1));
const oneHourLater = new DateService(addHours(today.date, 1));
const oneDayLater = new DateService(addDays(today.date, 1));
const oneDaySoon = new DateService(subDays(today.date, 1));
const twoDayLater = new DateService(addDays(today.date, 2));
const twoDaySoon = new DateService(subDays(today.date, 2));

describe('[필터 상태]', () => {
  describe('세팅', () => {
    describe('당일인 경우', () => {
      it('세팅 시간 이전인 경우, 경과 일수는 0 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: oneDaySoon.dateTimeStr,
                  close_date: oneHourLater.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.elapseSetupDay).toBe(0);
      });

      it('세팅 시간 이후일 경우, 경과 일수는 0 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: oneDaySoon.dateTimeStr,
                  close_date: oneHourSoon.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.elapseSetupDay).toBe(0);
      });
    });

    describe('당일이 아닌 경우', () => {
      it('하루가 남았을 경우, 경과 일수는 Infinity 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: oneDayLater.dateTimeStr,
                  close_date: twoDayLater.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.elapseSetupDay).toBe(Infinity);
      });

      it('하루가 지났을 경우, 경과 일수는 1 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: twoDaySoon.dateTimeStr,
                  close_date: oneDaySoon.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.elapseSetupDay).toBe(1);
      });
    });
  });

  describe('탈거', () => {
    describe('당일인 경우', () => {
      it('탈거 시간 이전일 경우, 남은 일수는 0 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: oneHourSoon.dateTimeStr,
                  close_date: oneDayLater.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.remainSetupDay).toBe(0);
      });

      it('탈거 시간 이후일 경우, 남은 일수는 0 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: oneHourLater.dateTimeStr,
                  close_date: oneDayLater.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.remainSetupDay).toBe(0);
      });
    });

    describe('당일이 아닌 경우', () => {
      it('하루가 남았을 경우, 남은 일수는 1 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: oneDayLater.dateTimeStr,
                  close_date: twoDayLater.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.remainSetupDay).toBe(1);
      });

      it('이후일 경우, 남은 일수는 Infinity 이어야 한다.', () => {
        const { result } = renderHook(() =>
          useFilter(
            {
              ...mockCrag,
              schedules: [
                {
                  id: '',
                  type: 'setup',
                  open_date: twoDaySoon.dateTimeStr,
                  close_date: oneDaySoon.dateTimeStr,
                  created_at: new Date(),
                  is_all_day: false,
                },
              ],
            },
            today.date
          )
        );

        expect(result.current.remainSetupDay).toBe(Infinity);
      });
    });
  });
});
