import { Slider } from '@mui/material';

import { DateService } from '@/utils/time';
import { useRef, useState } from 'react';

export function TimeRangeSlider({
  start,
  end,
  locked = false,
  onChange,
}: {
  start: number;
  end: number;
  onChange: (start: number, end: number) => void;
  locked?: boolean;
}) {
  const [timeStart, setTimeStart] = useState(start);
  const [timeEnd, setTimeEnd] = useState(end);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <Slider
      min={0}
      max={23 * 60 + 59}
      step={15}
      disabled={locked}
      value={[timeStart, timeEnd]}
      onChange={(_, [s, e]) => {
        setTimeStart(s);
        setTimeEnd(e);

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          onChange(s, e);
        }, 500);
      }}
      valueLabelDisplay="on"
      valueLabelFormat={(value) => {
        return DateService.minuteToTimeStr(value);
      }}
    />
  );
}
