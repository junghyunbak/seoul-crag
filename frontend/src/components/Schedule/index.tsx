import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useExp } from '@/hooks';

import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore } from 'date-fns';

import { SCHEDULE_TYPE_TO_INDEX } from '@/constants';

import { DateService } from '@/utils/time';

import { ScheduleWrapper } from './ScheduleWrapper';

import holidayData from './holidays.ko.json';
import { ScheduleHeader } from './ScheduleHeader';
import { ScheduleElement } from './ScheduleElement';

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

  return (
    <Paper>
      <Grid container columns={7}>
        <ScheduleHeader />

        {Array.from({ length: emptyStart }).map((_, idx) => (
          <ScheduleWrapper key={`empty-${idx}`} />
        ))}

        {days.map((day, i) => {
          const current = new DateService(day);

          const filteredSchedules = schedules
            .sort((a, b) => (SCHEDULE_TYPE_TO_INDEX[a.type] < SCHEDULE_TYPE_TO_INDEX[b.type] ? -1 : 1))
            .filter(({ open_date, close_date }) => {
              const open = new DateService(open_date);
              const close = new DateService(close_date);

              /**
               * 0시 ~ 23분 59분 59초 | 0시 ~ 23시 59분 59초 | 0시 ~ 23시 59분 59초
               *                <---^--->            <---^--->
               *                  (day)               (dayEnd)
               *
               * 하루 사이에 걸친 일정을 체크하기 위해 경계값을 기준으로 비교함.
               */
              const dayStart = day;
              const dayEnd = new Date(day.getTime() + 1000 * 60 * 60 * 24 - 1);

              return isBefore(open.date, dayEnd) && isBefore(dayStart, close.date);
            });

          const isToday = current.dateStr === exp.dateStr;
          const currentWeek = Math.ceil((emptyStart + i + 1) / 7);

          return (
            <ScheduleWrapper
              key={current.dateStr}
              isLastLine={currentWeek === lastWeek}
              isRightCorner={(i + emptyStart) % 7 === 6}
              isToday={isToday}
              isHoliday={holidays.includes(current.dateStr)}
              date={day}
            >
              <ScheduleElement
                schedules={filteredSchedules}
                onScheduleElementClick={onScheduleElementClick}
                current={current}
                readOnly={readOnly}
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
