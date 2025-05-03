import { useEffect, useState } from 'react';

import { Typography } from '@mui/material';

import { useFilter } from '@/hooks';

import { DAYS_OF_KOR } from '@/constants/time';

function formatTimeParts(date: Date) {
  return {
    hours: date.getHours().toString().padStart(2, '0'),
    minutes: date.getMinutes().toString().padStart(2, '0'),
    month: (date.getMonth() + 1).toString().padStart(2, '0'),
    date: date.getDate().toString().padStart(2, '0'),
    day: DAYS_OF_KOR[date.getDay()],
  };
}

export default function CurrentTime() {
  const [time, setTime] = useState(new Date());

  const { selectDate } = useFilter();

  useEffect(() => {
    setTime(selectDate || new Date());
  }, [selectDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(selectDate || new Date());
    }, 1000 * 10);

    return () => clearInterval(interval);
  }, [selectDate]);

  const { month, date, day, hours, minutes } = formatTimeParts(time);

  return (
    <Typography
      variant="h4"
      sx={{ color: 'black', textShadow: '-1px 0 white,0 1px white,1px 0 white,0 -1px white', fontFamily: 'DS-Digital' }}
    >
      {`${month}월 ${date}일 (${day}) ${hours}`}
      <Typography
        component="span"
        variant="h4"
        sx={{
          animation: selectDate ? 'none' : 'blink 1s step-start infinite',
          '@keyframes blink': {
            '50%': {
              opacity: 0,
            },
          },
        }}
      >
        :
      </Typography>
      {minutes}
    </Typography>
  );
}
