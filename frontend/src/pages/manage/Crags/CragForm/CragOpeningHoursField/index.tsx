import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { WeeklyHoursSlider, WeeklyHours, daysOfWeek } from '@/components/WeeklyHoursSilder';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import dayjs from 'dayjs';

import { useFetchOpeningHours, useMutateCragOpeningHour } from '@/hooks';

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

  const { changeCragOpeningHourMutation } = useMutateCragOpeningHour({
    onSettled() {
      /**
       * 경합조건 발생 위험이 있어 당장은 서버와 상태 동기화를 하지 않음.
       */
      //refetch();
    },
  });

  const { openingHours } = useFetchOpeningHours(crag.id);

  useEffect(() => {
    if (!openingHours) {
      return;
    }

    /**
     * 상태 hours의 초기값도 initialWeeklyHours 임.
     *
     * initialWeeklyHours을 그대로 초기값으로 사용하면 상태변화를 인식하지 못함.
     */
    const weeklyHours: WeeklyHours = { ...initialWeeklyHours };

    openingHours.forEach(({ day, open_time, close_time, is_closed }) => {
      if (open_time && close_time) {
        weeklyHours[day] = {
          is_closed,
          open: timeStrToMinutes(open_time),
          close: timeStrToMinutes(close_time),
        };
      }
    });

    setHours(weeklyHours);
  }, [openingHours]);

  const handleWeeklyHoursChange = (next: WeeklyHours) => {
    setHours((prev) => {
      for (const day of daysOfWeek) {
        if (prev[day] !== next[day]) {
          if (timerRef.current[day]) {
            clearTimeout(timerRef.current[day]);
          }

          timerRef.current[day] = setTimeout(async () => {
            const { open, close, is_closed } = next[day];

            changeCragOpeningHourMutation.mutate({
              cragId: crag.id,
              day,
              openTime: minutesToTimeStr(open),
              closeTime: minutesToTimeStr(close),
              isClosed: is_closed,
            });
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
