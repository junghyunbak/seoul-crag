import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useQuery } from '@tanstack/react-query';

import { WeeklyHoursSlider, WeeklyHours, daysOfWeek } from '@/components/WeeklyHoursSilder';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import dayjs from 'dayjs';

import { api } from '@/api/axios';

import { openingHoursScheme } from '@/schemas';

const defaultOpen = 9 * 60;
const defaultClose = 22 * 60;
const defaultHolidayOpen = 10 * 60;
const defaultHoildayClose = 20 * 60;

const initialWeeklyHours: WeeklyHours = {
  sunday: { is_closed: false, open: defaultHolidayOpen, close: defaultHoildayClose },
  monday: { is_closed: false, open: defaultOpen, close: defaultClose },
  tuesday: { is_closed: false, open: defaultOpen, close: defaultClose },
  wednesday: { is_closed: false, open: defaultOpen, close: defaultClose },
  thursday: { is_closed: false, open: defaultOpen, close: defaultClose },
  friday: { is_closed: false, open: defaultOpen, close: defaultClose },
  saturday: { is_closed: false, open: defaultHolidayOpen, close: defaultHoildayClose },
};

function minutesToTimeStr(mins: number): string {
  return dayjs().startOf('day').add(mins, 'minute').format('HH:mm');
}

function timeStrToMinutes(time: string): number {
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

  const { data } = useQuery({
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

    /**
     * 상태 hours의 초기값도 initialWeeklyHours 임.
     *
     * initialWeeklyHours을 그대로 초기값으로 사용하면 상태변화를 인식하지 못함.
     */
    const weeklyHours: WeeklyHours = { ...initialWeeklyHours };

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

  return (
    <Box>
      <Typography variant="h6">운영 시간</Typography>
      <WeeklyHoursSlider hours={hours} onChange={handleWeeklyHoursChange} />
    </Box>
  );
}
