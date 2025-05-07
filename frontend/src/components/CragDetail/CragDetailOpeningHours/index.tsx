import { useContext } from 'react';

import { Box, Typography } from '@mui/material';

import { useExp, useFilter } from '@/hooks';

import { addDays, format } from 'date-fns';

import { DAYS_OF_KOR } from '@/constants/time';

import { CragDetailContext } from '@/components/CragDetail/index.context';

export function CragDetailOpeningHours() {
  const { crag } = useContext(CragDetailContext);
  const { exp } = useExp();

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
          const date = addDays(exp.date, i);

          return <OpeningInfo key={i} crag={crag} date={date} />;
        })}
    </Box>
  );
}

interface OpeningInfoProps {
  crag: Crag;
  date: Date;
}

function OpeningInfo({ crag, date }: OpeningInfoProps) {
  const { open, close, isReduced, isRegularyClosed, isTemporaryClosed, current } = useFilter(crag, date);
  const { exp } = useExp();

  const isToday = exp.dateStr === current.dateStr;

  return (
    <Box
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
        {isRegularyClosed
          ? '정기 휴무'
          : `${isTemporaryClosed ? '(임시 휴일) ' : isReduced ? '(단축 운영)' : ''} ${format(
              open.date,
              'HH:mm'
            )} - ${format(close.date, 'HH:mm')}`}
      </Typography>
    </Box>
  );
}
