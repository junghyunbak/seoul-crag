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
const today = new DateService(dateTimeStr).date;

const todayCloseOpeningHour: OpeningHour = {
  id: '',
  day: DAYS_OF_WEEK[today.getDay()],
  open_time: timeStr,
  close_time: timeStr,
  is_closed: true,
};

const todayCloseSchedule: Schedule = {
  id: '',
  type: 'closed',
  open_date: dateTimeStr,
  close_date: dateTimeStr,
  created_at: new Date(),
};

const todayReduceSchedule: Schedule = {
  id: '',
  open_date: dateTimeStr,
  close_date: dateTimeStr,
  type: 'reduced',
  created_at: new Date(),
};

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
        today
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
        today
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
        today
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
        today
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
        today
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
        today
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
        today
      );

      return { isOff };
    });

    expect(result.current.isOff).toBe(false);
  });
});
