import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Button, Typography, Switch, FormControlLabel } from '@mui/material';

import { DAY_STR_TO_KOR, DAYS_OF_WEEK } from '@/constants/time';

import { Molecules } from '@/components/molecules';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

import { DateService } from '@/utils/time';

import { useFetchOpeningHours, useMutateCragOpeningHour } from '@/hooks';

export type DayRange = {
  is_closed: boolean;
  open: number;
  close: number;
};

export type WeeklyHours = Record<OpeningHourDayType, DayRange>;

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

export function CragOpeningHoursField() {
  const { crag } = useContext(cragFormContext);

  const [hours, setHours] = useState(initialWeeklyHours);
  const [locked, setLocked] = useState(true);

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
      weeklyHours[day] = {
        is_closed,
        open: DateService.timeStrToMinute(open_time),
        close: DateService.timeStrToMinute(close_time),
      };
    });

    setHours(weeklyHours);
  }, [openingHours]);

  const handleWeeklyHoursChange = (next: WeeklyHours) => {
    setHours((prev) => {
      for (const day of DAYS_OF_WEEK) {
        if (prev[day] !== next[day]) {
          if (timerRef.current[day]) {
            clearTimeout(timerRef.current[day]);
          }

          timerRef.current[day] = setTimeout(async () => {
            const { open, close, is_closed } = next[day];

            changeCragOpeningHourMutation.mutate({
              cragId: crag.id,
              day,
              openTime: DateService.minuteToTimeStr(open),
              closeTime: DateService.minuteToTimeStr(close),
              isClosed: is_closed,
            });
          }, 1000);
        }
      }

      return next;
    });
  };

  return (
    <Box sx={{ userSelect: 'none' }}>
      <Typography variant="h6">운영 시간</Typography>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
          {DAYS_OF_WEEK.map((day) => {
            const { is_closed, open, close } = hours[day];

            return (
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  {DAY_STR_TO_KOR[day]}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={is_closed}
                        onChange={(e) => {
                          handleWeeklyHoursChange({
                            ...hours,
                            [day]: {
                              ...hours[day],
                              is_closed: e.target.checked,
                            },
                          });
                        }}
                        disabled={locked}
                      />
                    }
                    label="휴무"
                  />

                  <Box
                    sx={{
                      flex: 1,
                      px: 2,
                    }}
                  >
                    <Molecules.TimeRangeSlider
                      start={open}
                      end={close}
                      locked={locked}
                      onChange={(start, end) => {
                        handleWeeklyHoursChange({
                          ...hours,
                          [day]: {
                            ...hours[day],
                            open: start,
                            close: end,
                          },
                        });
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        <Button variant={locked ? 'outlined' : 'contained'} onClick={() => setLocked(!locked)}>
          {locked ? '편집 잠금 해제' : '편집 잠금'}
        </Button>
      </Box>
    </Box>
  );
}
