import { useContext } from 'react';

import { Box, styled, Typography } from '@mui/material';

import { useExp, useFilter } from '@/hooks';

import { addDays, format, startOfWeek } from 'date-fns';

import { DAYS_OF_KOR } from '@/constants/time';

import { CragDetailContext } from '@/components/CragDetail/index.context';

export function CragDetailOpeningHours() {
  const { crag } = useContext(CragDetailContext);
  const { exp } = useExp();

  const weekStart = startOfWeek(exp.date, { weekStartsOn: 0 });

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
          const date = addDays(weekStart, i);

          return <OpeningInfo key={i} crag={crag} date={date} />;
        })}
    </Box>
  );
}

const TimeText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isToday',
})<{ isToday?: boolean }>(({ isToday = false }) => ({
  color: isToday ? 'black' : 'text.secondary',
  fontWeight: isToday ? 'bold' : 'normal',
}));

interface OpeningInfoProps {
  crag: Crag;
  date: Date;
}

function OpeningInfo({ crag, date }: OpeningInfoProps) {
  const { open, close, originOpen, originClose, isReduced, isTemporaryClosed, current, isOperate } = useFilter(
    crag,
    date
  );
  const { exp } = useExp();

  const isToday = exp.dateStr === current.dateStr;

  const operateTime = (() => {
    const duration = ` ${format(open.date, 'HH:mm')} - ${format(close.date, 'HH:mm')}`;
    const originDuration = ` ${format(originOpen.date, 'HH:mm')} - ${format(originClose.date, 'HH:mm')}`;

    if (isTemporaryClosed) {
      return <TimeText variant="body2" isToday={isToday}>{`(임시 휴무) ${duration}`}</TimeText>;
    }

    if (isOperate) {
      if (isReduced) {
        return (
          <TimeText variant="body2" isToday={isToday}>
            (단축 운영){originDuration} ← <del>{duration}</del>
          </TimeText>
        );
      } else {
        return (
          <TimeText variant="body2" isToday={isToday}>
            {duration}
          </TimeText>
        );
      }
    }

    return (
      <TimeText variant="body2" isToday={isToday}>
        정기 휴무
      </TimeText>
    );
  })();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <TimeText variant="body2" isToday={isToday}>
        {DAYS_OF_KOR[date.getDay()]}
      </TimeText>

      {operateTime}
    </Box>
  );
}
