import { Slider } from '@mui/material';

import { DateService } from '@/utils/time';

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
  return (
    <Slider
      min={0}
      max={23 * 60 + 59}
      step={15}
      disabled={locked}
      value={[start, end]}
      onChange={(_, value) => onChange(value[0], value[1])}
      valueLabelDisplay="on"
      valueLabelFormat={(value) => {
        return DateService.minuteToTimeStr(value);
      }}
    />
  );
}
