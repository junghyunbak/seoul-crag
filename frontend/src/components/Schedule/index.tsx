import { Box, Typography, Stack, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';

import { useFilter } from '@/hooks';

import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isBefore } from 'date-fns';

import holidayData from './holidays.ko.json';

import { DAY_LABELS, SCHEDULE_TYPE_TO_COLORS, SCHEDULE_TYPE_TO_LABELS } from '@/constants';
import { time } from '@/utils';

const SCHEDULE_TYPE_TO_INDEX: Record<ScheduleType, number> = {
  setup: 0,
  closed: 1,
  reduced: 2,
};

interface ScheduleProps {
  currentMonth: Date;
  schedules: Schedule[];
  onScheduleElementClick: (schedule: Schedule) => void;
  readOnly?: boolean;
}

export function Schedule({ schedules, currentMonth, onScheduleElementClick, readOnly = false }: ScheduleProps) {
  const { expeditionDate } = useFilter();

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const emptyStart = getDay(start);
  const holidays: string[] = holidayData[2025];
  const lastWeek = Math.ceil((emptyStart + days.length) / 7);
  const emptyEnd = lastWeek * 7 - emptyStart - days.length;
  const isHoliday = (iso: string, date: Date) => holidays.includes(iso) || getDay(date) === 0;

  return (
    <Paper>
      <Grid container columns={7}>
        {DAY_LABELS.map((label, i) => (
          <Grid size={{ xs: 1 }} key={label} sx={{ borderRight: i === 6 ? 'none' : '1px solid #ccc' }}>
            <Typography align="center" fontWeight={600} sx={{ color: i === 0 ? 'error.main' : undefined }}>
              {label}
            </Typography>
          </Grid>
        ))}

        {Array.from({ length: emptyStart }).map((_, idx) => (
          <Grid
            size={{ xs: 1 }}
            key={`empty-${idx}`}
            sx={{
              height: 100,
              borderRight: '1px solid #ccc',
              borderBottom: '1px solid #ccc',
              p: 0.5,
              pl: 0,
              pb: 0,
            }}
          />
        ))}

        {days.map((day, i) => {
          const filteredSchedules = schedules
            .sort((a, b) => (SCHEDULE_TYPE_TO_INDEX[a.type] < SCHEDULE_TYPE_TO_INDEX[b.type] ? -1 : 1))
            .filter(({ open_date, close_date }) => {
              const openDate = time.dateTimeStrToDate(open_date);
              const closeDate = time.dateTimeStrToDate(close_date);

              /**
               * 0시 ~ 23분 59분 59초 | 0시 ~ 23시 59분 59초 | 0시 ~ 23시 59분 59초
               *                <---^--->            <---^--->
               *                  (day)               (dayEnd)
               *
               * 하루 사이에 걸친 일정을 체크하기 위해 경계값을 기준으로 비교함.
               */
              const dayStart = day;
              const dayEnd = new Date(day.getTime() + 1000 * 60 * 60 * 24 - 1);

              return isBefore(openDate, dayEnd) && isBefore(dayStart, closeDate);
            });

          const scheduleDateStr = time.dateToDateStr(day);
          const expeditionDateStr = time.dateToDateStr(expeditionDate);

          const isToday = scheduleDateStr === expeditionDateStr;
          const currentWeek = Math.ceil((emptyStart + i + 1) / 7);

          return (
            <Grid
              size={{ xs: 1 }}
              key={scheduleDateStr}
              sx={{
                borderRight: (i + emptyStart) % 7 === 6 ? 'none' : '1px solid #ccc',
                borderBottom: currentWeek === lastWeek ? 'none' : '1px solid #ccc',
                height: 100,
                position: 'relative',
                pt: 0.5,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                align="center"
                variant="body2"
                sx={{
                  background: isToday ? '#1976d2' : undefined,
                  borderRadius: isToday ? '50%' : undefined,
                  color: isHoliday(scheduleDateStr, day) ? 'error.main' : undefined,
                  width: 24,
                  height: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                }}
              >
                {format(day, 'd')}
              </Typography>

              <Stack mt={0.5} sx={{ flex: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    overflowY: 'scroll',
                    gap: 0.5,
                    scrollbarWidth: 'none',
                    '&::-webkit-scrollbar': { display: 'none' },
                  }}
                >
                  {filteredSchedules.map((schedule, i, arr) => {
                    const isFirst = time.dateTimeStrToDateStr(schedule.open_date) === scheduleDateStr;
                    const isLast = time.dateTimeStrToDateStr(schedule.close_date) === scheduleDateStr;

                    let left = 0;
                    let right = 0;

                    switch (schedule.type) {
                      case 'closed': {
                        break;
                      }
                      case 'reduced':
                      case 'setup': {
                        if (isFirst && isLast) {
                          left = 0;
                          right = 0;
                        } else if (isFirst) {
                          const minutes = time.getTodayMinutesFromDate(time.dateTimeStrToDate(schedule.open_date));

                          left = (minutes / 1440) * 100;
                          right = 0;
                        } else if (isLast) {
                          const minutes = time.getTodayMinutesFromDate(time.dateTimeStrToDate(schedule.close_date));

                          left = 0;
                          right = ((1440 - minutes) / 1440) * 100;
                        }

                        break;
                      }
                    }

                    return (
                      <Box
                        key={schedule.id}
                        sx={{
                          width: '100%',
                          display: 'flex',
                        }}
                      >
                        <Box sx={{ width: `${left}%` }} />
                        <Box
                          sx={{
                            flex: 1,
                            overflow: 'hidden',
                            bgcolor: SCHEDULE_TYPE_TO_COLORS[schedule.type],
                            px: { md: 1, xs: 0.5 },
                            py: 0.2,
                            mb: arr.length - 1 === i ? 0.5 : 0,
                            borderTopLeftRadius: isFirst ? 4 : 0,
                            borderBottomLeftRadius: isFirst ? 4 : 0,
                            borderTopRightRadius: isLast ? 4 : 0,
                            borderBottomRightRadius: isLast ? 4 : 0,
                            cursor: readOnly ? 'default' : 'pointer',
                          }}
                          onClick={() => onScheduleElementClick(schedule)}
                        >
                          <Typography
                            sx={{
                              color: 'white',
                              fontSize: { md: 12, xs: 8 },
                            }}
                          >
                            {SCHEDULE_TYPE_TO_LABELS[schedule.type]}
                          </Typography>
                        </Box>
                        <Box sx={{ width: `${right}%` }} />
                      </Box>
                    );
                  })}
                </Box>
              </Stack>
            </Grid>
          );
        })}

        {Array.from({ length: emptyEnd }).map((_, idx) => (
          <Grid
            size={{ xs: 1 }}
            key={`empty-${idx}`}
            style={{
              borderRight: emptyEnd - 1 === idx ? 'none' : '1px solid #ccc',
            }}
            sx={{
              height: 100,
              p: 0.5,
              pl: 0,
              pb: 0,
            }}
          />
        ))}
      </Grid>
    </Paper>
  );
}
