import { useContext } from 'react';

import { Box, styled, Typography } from '@mui/material';

import { useExp, useFilter } from '@/hooks';

import { addDays, format, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

import { CragDetailContext } from '../index.context';

import { DAY_LABELS } from '@/constants';

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

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {Array(7)
          .fill(null)
          .map((_, i) => {
            const date = addDays(weekStart, i);

            return <OpeningInfo key={i} crag={crag} date={date} />;
          })}
      </Box>
    </Box>
  );
}

const TimeText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isToday',
})<{ isToday?: boolean }>(({ theme, isToday = false }) => ({
  color: isToday ? 'black' : theme.palette.text.secondary,
  fontWeight: isToday ? 'bold' : 'normal',
  fontFamily: 'Roboto Mono, monospace',
  textAlign: 'right',
}));

interface OpeningInfoProps {
  crag: Crag;
  date: Date;
}

function OpeningInfo({ crag, date }: OpeningInfoProps) {
  const { open, close, originOpen, originClose, isReduced, isTemporaryClosed, current, isOperate } = useFilter(crag, {
    date,
  });
  const { exp } = useExp();

  const isToday = exp.dateStr === current.dateStr;

  const operateTime = (() => {
    const duration = ` ${format(open.date, 'a hh:mm', { locale: ko })} ~ ${format(close.date, 'a hh:mm', {
      locale: ko,
    })}`;
    const originDuration = ` ${format(originOpen.date, 'a hh:mm', { locale: ko })} ~ ${format(
      originClose.date,
      'a hh:mm',
      { locale: ko }
    )}`;

    if (isTemporaryClosed) {
      return <TimeText variant="body2" isToday={isToday}>{`(임시 휴무) ${duration}`}</TimeText>;
    }

    if (isOperate) {
      if (isReduced) {
        return (
          <TimeText variant="body2" isToday={isToday}>
            <del>{originDuration}</del>
            <br />
            (단축 운영){duration}
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
      sx={(theme) => ({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 0.5,
        borderBottom: `1px dashed ${theme.palette.divider}`,
        '&:last-of-type': {
          borderBottom: 0,
        },
      })}
    >
      <TimeText variant="body2" isToday={isToday}>
        {DAY_LABELS[date.getDay()]}
      </TimeText>

      {operateTime}
    </Box>
  );
}
