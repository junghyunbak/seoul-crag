import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useExp } from '@/hooks';

import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, parseISO } from 'date-fns';

import { DateService } from '@/utils/time';

import { ScheduleWrapper } from './ScheduleWrapper';

import holidayData from './holidays.ko.json';
import { ScheduleHeader } from './ScheduleHeader';
import { ScheduleElement } from './ScheduleElement';
import { useMemo } from 'react';

interface ScheduleProps {
  currentMonth: Date;
  schedules: Schedule[];
  onScheduleElementClick: (schedule: Schedule) => void;
  readOnly?: boolean;
}

export function Schedule({ schedules, currentMonth, onScheduleElementClick, readOnly = false }: ScheduleProps) {
  const { exp } = useExp();

  const holidays: string[] = holidayData[2025];

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);

  const days = eachDayOfInterval({ start, end });

  const emptyStart = getDay(start);
  const lastWeek = Math.ceil((emptyStart + days.length) / 7);
  const emptyEnd = lastWeek * 7 - emptyStart - days.length;

  const dateToSchedule = useMemo(() => {
    const map = new Map<string, Schedule[]>();

    schedules.forEach((schedule) => {
      const { open_date, close_date } = schedule;

      const start = parseISO(open_date);
      const end = parseISO(close_date);

      eachDayOfInterval({ start, end }).forEach((date) => {
        const dateStr = new DateService(date).dateStr;

        const _schedules = map.get(dateStr) || [];

        _schedules.push(schedule);

        map.set(dateStr, _schedules);
      });
    });

    return map;
  }, [schedules]);

  console.log(dateToSchedule);

  return (
    <Paper>
      <Grid container columns={7}>
        <ScheduleHeader />

        {Array.from({ length: emptyStart }).map((_, idx) => (
          <ScheduleWrapper key={`empty-${idx}`} />
        ))}

        {days.map((day, i) => {
          const current = new DateService(day);

          const currentWeek = Math.ceil((emptyStart + i + 1) / 7);

          const isToday = current.dateStr === exp.dateStr;
          const isHoliday = holidays.includes(current.dateStr);
          const isLastLine = currentWeek === lastWeek;
          const isRightCorner = (i + emptyStart) % 7 === 6;

          return (
            <ScheduleWrapper
              key={current.dateStr}
              date={day}
              isToday={isToday}
              isHoliday={isHoliday}
              isLastLine={isLastLine}
              isRightCorner={isRightCorner}
            >
              <ScheduleElement
                current={current}
                readOnly={readOnly}
                schedules={dateToSchedule.get(current.dateStr) || []}
                onScheduleElementClick={onScheduleElementClick}
              />
            </ScheduleWrapper>
          );
        })}

        {Array.from({ length: emptyEnd }).map((_, idx) => (
          <ScheduleWrapper key={`empty-${idx}`} isRightCorner={emptyEnd - 1 === idx} isLastLine />
        ))}
      </Grid>
    </Paper>
  );
}
