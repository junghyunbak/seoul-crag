import { Box, Typography, styled } from '@mui/material';

import { time } from '@/utils';
import { addDays, format } from 'date-fns';
import { DAY_TO_INDEX } from '@/constants/time';
import { useExp } from '@/hooks';

const TextWithBg = styled(Typography)({
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontFamily: 'synthese-boldoblique',
  background: '#f25360',
  color: 'white',
  padding: '2%',
});

const Text = styled(Typography)({
  fontWeight: 'bold',
  fontStyle: 'italic',
  fontFamily: 'synthese-boldoblique',
  color: 'white',
  padding: '2%',
});

interface StoryOperationPageProps {
  crag: Crag;
  openingHour: OpeningHour;
}

export function StoryOperationPage({ crag, openingHour }: StoryOperationPageProps) {
  const { day, open_time, close_time, is_closed } = openingHour;

  const { exp } = useExp();

  const date = addDays(exp.date, (DAY_TO_INDEX[day] - exp.date.getDay() + 7) % 7);

  let openDate = time.timeStrToDate(open_time);
  let closeDate = time.timeStrToDate(close_time);
  let isReduced = false;

  const isClosed = (() => {
    if (is_closed) {
      return true;
    }

    return (crag?.futureSchedules || []).some(({ type, open_date }) => {
      if (type === 'closed' && time.dateTimeStrToDateStr(open_date) === time.dateToDateStr(date)) {
        return true;
      }

      return false;
    });
  })();

  (crag?.futureSchedules || []).forEach(({ type, open_date, close_date }) => {
    if (
      type === 'reduced' &&
      time.dateTimeStrToDateStr(open_date) === time.dateToDateStr(date) &&
      time.dateTimeStrToDateStr(close_date) === time.dateToDateStr(date)
    ) {
      isReduced = true;
      openDate = time.dateTimeStrToDate(open_date);
      closeDate = time.dateTimeStrToDate(close_date);
    }
  });

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 1,
          background: 'linear-gradient(57deg,rgba(234, 115, 128, 1) 0%, rgba(240, 221, 213, 1) 100%)',
        }}
      >
        <Text variant="h2">{format(date, 'yyyy.MM.dd')}</Text>
        <Text variant="h2">{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
        {isClosed ? (
          <TextWithBg variant="h2">Off</TextWithBg>
        ) : (
          <>
            <TextWithBg variant="h3" sx={{ color: isReduced ? 'yellow' : 'white' }}>{`${format(
              openDate,
              'a hh:mm'
            )} ~`}</TextWithBg>
            <TextWithBg
              variant="h3"
              sx={{
                color: isReduced ? 'yellow' : 'white',
              }}
            >{`${format(closeDate, 'a hh:mm')}`}</TextWithBg>
          </>
        )}
      </Box>
    </Box>
  );
}
