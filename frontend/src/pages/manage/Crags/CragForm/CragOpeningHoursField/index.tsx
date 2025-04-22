import { useContext, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { WeeklyHoursSlider, WeeklyHours, daysOfWeek } from '@/components/WeeklyHoursSilder';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import dayjs from 'dayjs';

import { api } from '@/api/axios';
import { openingHoursScheme } from '@/schemas';

const initialWeeklyHours: WeeklyHours = {
  monday: { is_closed: false, open: 9 * 60, close: 22 * 60 },
  tuesday: { is_closed: false, open: 9 * 60, close: 22 * 60 },
  wednesday: { is_closed: false, open: 9 * 60, close: 22 * 60 },
  thursday: { is_closed: false, open: 9 * 60, close: 22 * 60 },
  friday: { is_closed: false, open: 9 * 60, close: 22 * 60 },
  saturday: { is_closed: false, open: 10 * 60, close: 20 * 60 },
  sunday: { is_closed: false, open: 10 * 60, close: 20 * 60 },
};

function minutesToTimeStr(mins: number): string {
  return dayjs().startOf('day').add(mins, 'minute').format('HH:mm');
}

export function timeStrToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function CragOpeningHoursField() {
  const { crag } = useContext(cragFormContext);

  const [hours, setHours] = useState(initialWeeklyHours);

  const timerRef = useRef<Record<OpeningHourDayType, ReturnType<typeof setTimeout> | null>>({
    sunday: null,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null,
    saturday: null,
  });

  const { data, refetch } = useQuery({
    queryKey: ['openingHours', crag.id],
    queryFn: async () => {
      const { data } = await api.get(`/gyms/${crag.id}/opening-hours`);

      const openingHours = openingHoursScheme.parse(data);

      return openingHours;
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const weeklyHours: WeeklyHours = initialWeeklyHours;

    data.forEach(({ day, open_time, close_time, is_closed }) => {
      if (open_time && close_time) {
        weeklyHours[day] = {
          is_closed,
          open: timeStrToMinutes(open_time),
          close: timeStrToMinutes(close_time),
        };
      }
    });

    setHours(weeklyHours);
  }, [data]);

  const handleWeeklyHoursChange = (next: WeeklyHours) => {
    setHours((prev) => {
      for (const week of daysOfWeek) {
        if (prev[week] !== next[week]) {
          if (timerRef.current[week]) {
            clearTimeout(timerRef.current[week]);
          }

          timerRef.current[week] = setTimeout(async () => {
            const { open, close, is_closed } = next[week];

            await api.patch(`/gyms/${crag.id}/opening-hours`, {
              day: week,
              open_time: minutesToTimeStr(open),
              close_time: minutesToTimeStr(close),
              is_closed,
            });

            /**
             * 경합조건 발생 위험이 있어 당장은 서버와 상태 동기화를 하지 않음.
             */
            //refetch();
          }, 1000);
        }
      }

      return next;
    });
  };

  return <WeeklyHoursSlider value={hours} onChange={handleWeeklyHoursChange} />;
}
