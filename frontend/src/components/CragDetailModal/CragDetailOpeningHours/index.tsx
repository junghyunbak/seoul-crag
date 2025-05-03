import { Box, Typography } from '@mui/material';

import { time } from '@/utils';

import { useFilter } from '@/hooks';

import { getDay } from 'date-fns';

import { DAY_TO_INDEX } from '@/constants/time';

interface CragDetailOpeningHoursProps {
  crag: Crag | undefined | null;
}

export function CragDetailOpeningHours({ crag }: CragDetailOpeningHoursProps) {
  const { selectDate } = useFilter();

  const selectDay = getDay(selectDate || new Date());

  if (!crag) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        이용 시간
      </Typography>
      {crag.openingHourOfWeek &&
        crag.openingHourOfWeek
          .sort((a, b) => (DAY_TO_INDEX[a.day] < DAY_TO_INDEX[b.day] ? -1 : 1))
          .map(({ id, day, open_time, close_time, is_closed }) => {
            if (!(open_time && close_time)) {
              return null;
            }

            const isToday = DAY_TO_INDEX[day] === selectDay;

            const [oh, om] = open_time.split(':');
            const [ch, cm] = close_time.split(':');

            return (
              <Box
                key={id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: isToday ? 'black' : 'text.secondary',
                    fontWeight: isToday ? 'bold' : 'normal',
                  }}
                >
                  {time.engDayToKor(day)}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: isToday ? 'black' : 'text.secondary',
                    fontWeight: isToday ? 'bold' : 'normal',
                  }}
                >
                  {is_closed ? '정기 휴무' : `${oh}:${om} - ${ch}:${cm}`}
                </Typography>
              </Box>
            );
          })}
    </Box>
  );
}
