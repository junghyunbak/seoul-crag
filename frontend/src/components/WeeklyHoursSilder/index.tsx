import React, { useState } from 'react';

import { Box, Slider, Typography, Stack, Switch, FormControlLabel, Button } from '@mui/material';

import { DAY_STR_TO_KOR, DAYS_OF_WEEK } from '@/constants/time';

import { DateService } from '@/utils/time';

export type DayRange = {
  is_closed: boolean;
  open: number;
  close: number;
};

export type WeeklyHours = Record<OpeningHourDayType, DayRange>;

interface WeeklyHoursSliderProps {
  hours: WeeklyHours;
  onChange: (next: WeeklyHours) => void;
}

export const WeeklyHoursSlider: React.FC<WeeklyHoursSliderProps> = ({ hours, onChange }) => {
  const [locked, setLocked] = useState(true);

  return (
    <Box width="100%">
      <Stack width="100%">
        {DAYS_OF_WEEK.map((day) => {
          return <SliderContent key={day} hours={hours} onChange={onChange} locked={locked} day={day} />;
        })}
      </Stack>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant={locked ? 'outlined' : 'contained'} onClick={() => setLocked(!locked)}>
          {locked ? '편집 잠금 해제' : '편집 잠금'}
        </Button>
      </Box>
    </Box>
  );
};

interface SliderContentProps extends WeeklyHoursSliderProps {
  day: OpeningHourDayType;
  locked: boolean;
}

function SliderContent({ hours, day, locked, onChange }: SliderContentProps) {
  const { is_closed, open, close } = hours[day];

  const handleSliderChange = (day: OpeningHourDayType, newValue: number[]) => {
    if (locked) {
      return;
    }

    const [open, close] = newValue;

    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        open,
        close,
      },
    });
  };

  const handleSwitchChange = (day: OpeningHourDayType, checked: boolean) => {
    if (locked) {
      return;
    }

    onChange({
      ...hours,
      [day]: {
        ...hours[day],
        is_closed: checked,
      },
    });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle1" gutterBottom>
        {DAY_STR_TO_KOR[day]}
      </Typography>

      <Box
        sx={{
          display: 'flex',
        }}
      >
        <FormControlLabel
          control={
            <Switch checked={is_closed} onChange={(e) => handleSwitchChange(day, e.target.checked)} disabled={locked} />
          }
          label="휴무"
        />

        <Box
          sx={{
            flex: 1,
            px: 2,
          }}
        >
          <Slider
            min={0}
            max={23 * 60 + 59}
            step={15}
            disabled={locked}
            value={[open, close]}
            onChange={(_, val) => handleSliderChange(day, val as number[])}
            valueLabelDisplay="on"
            valueLabelFormat={(val) => {
              const [HH, mm] = DateService.minuteToTimeStr(val).split(':');

              return `${HH}:${mm}`;
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
