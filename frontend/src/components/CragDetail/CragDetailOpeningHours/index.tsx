import { Box, Typography } from '@mui/material';

import { time } from '@/utils';

import { useFilter } from '@/hooks';

import { addDays } from 'date-fns';

import { DAY_TO_INDEX, DAYS_OF_KOR } from '@/constants/time';

interface CragDetailOpeningHoursProps {
  crag: Crag | undefined | null;
}

export function CragDetailOpeningHours({ crag }: CragDetailOpeningHoursProps) {
  const { expeditionDate } = useFilter();

  if (!crag) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        이용 시간
      </Typography>
      {Array(7)
        .fill(null)
        .map((_, i) => {
          const date = addDays(expeditionDate, i);

          const openingHour = crag.openingHourOfWeek?.find(({ day }) => {
            return DAY_TO_INDEX[day] === date.getDay();
          });

          if (!openingHour) {
            return null;
          }

          const { open_time, close_time, is_closed } = openingHour;

          let [oh, om] = open_time.split(':');
          let [ch, cm] = close_time.split(':');

          const isToday = date.getDay() === expeditionDate.getDay();
          let isTemporaryClosed = false;
          let isReduced = false;

          (crag?.futureSchedules || []).forEach(({ type, open_date, close_date }) => {
            if (type === 'closed' && time.dateTimeStrToDateStr(open_date) === time.dateToDateStr(date)) {
              isTemporaryClosed = true;
            }

            if (
              type === 'reduced' &&
              time.dateTimeStrToDateStr(open_date) === time.dateToDateStr(date) &&
              time.dateTimeStrToDateStr(close_date) === time.dateToDateStr(date)
            ) {
              isReduced = true;
              [oh, om] = time.dateToTimeStr(time.dateTimeStrToDate(open_date)).split(':');
              [ch, cm] = time.dateToTimeStr(time.dateTimeStrToDate(close_date)).split(':');
            }
          });

          return (
            <Box
              key={i}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isToday ? 'black' : 'text.secondary',
                  fontWeight: isToday ? 'bold' : 'normal',
                }}
              >
                {DAYS_OF_KOR[date.getDay()]}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isToday ? 'black' : 'text.secondary',
                  fontWeight: isToday ? 'bold' : 'normal',
                }}
              >
                {is_closed
                  ? '정기 휴무'
                  : `${isTemporaryClosed ? '(임시 휴일) ' : isReduced ? '(단축 운영)' : ''} ${oh}:${om} - ${ch}:${cm}`}
              </Typography>
            </Box>
          );
        })}
    </Box>
  );
}
