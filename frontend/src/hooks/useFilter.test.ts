import { DAYS_OF_WEEK } from '@/constants/time';
import { useFilter } from './useFilter';
import { renderHook } from '@testing-library/react';

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

describe('스케줄에 따른 암장 상태 검사', () => {
  const dateStr = '2025-05-08';
  const timeStr = '09:03:00';
  const dateTimeStr = `${dateStr}T${timeStr}`;
  const today = new Date(dateTimeStr);

  it('오늘 날짜가 정기 휴무일 경우, isOff 상태가 true여야 한다.', () => {
    const { result } = renderHook(() => {
      const { isOff } = useFilter(
        {
          ...mockCrag,
          openingHourOfWeek: [
            {
              id: '',
              day: DAYS_OF_WEEK[today.getDay()],
              open_time: timeStr,
              close_time: timeStr,
              is_closed: true,
            },
          ],
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
          futureSchedules: [
            {
              id: '',
              type: 'closed',
              open_date: dateTimeStr,
              close_date: dateTimeStr,
              created_at: new Date(),
            },
          ],
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
          openingHourOfWeek: [
            {
              id: '',
              day: DAYS_OF_WEEK[today.getDay()],
              open_time: timeStr,
              close_time: timeStr,
              is_closed: true,
            },
          ],
          futureSchedules: [
            {
              id: '',
              open_date: dateTimeStr,
              close_date: dateTimeStr,
              type: 'reduced',
              created_at: new Date(),
            },
          ],
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
          futureSchedules: [
            {
              id: '',
              open_date: dateTimeStr,
              close_date: dateTimeStr,
              type: 'reduced',
              created_at: new Date(),
            },
            {
              id: '',
              type: 'closed',
              open_date: dateTimeStr,
              close_date: dateTimeStr,
              created_at: new Date(),
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
