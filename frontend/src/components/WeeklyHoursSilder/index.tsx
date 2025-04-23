import React, { useState } from 'react';
import { Box, Slider, Typography, Stack, Switch, FormControlLabel, Button } from '@mui/material';

function engDayToKor(engDay: OpeningHourDayType) {
  switch (engDay) {
    case 'sunday':
      return '일요일';
    case 'monday':
      return '월요일';
    case 'tuesday':
      return '화요일';
    case 'wednesday':
      return '수요일';
    case 'thursday':
      return '목요일';
    case 'friday':
      return '금요일';
    case 'saturday':
      return '토요일';
    default:
      return '';
  }
}

export const daysOfWeek: OpeningHourDayType[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const defaultOpen = 9 * 60; // 09:00 in minutes
const defaultClose = 22 * 60; // 22:00 in minutes

export type DayRange = {
  is_closed: boolean;
  open: number;
  close: number;
};

export type WeeklyHours = Record<OpeningHourDayType, DayRange>;

interface WeeklyHoursSliderProps {
  value: WeeklyHours;
  onChange: (next: WeeklyHours) => void;
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export const WeeklyHoursSlider: React.FC<WeeklyHoursSliderProps> = ({ value, onChange }) => {
  const [locked, setLocked] = useState(true);

  const handleSliderChange = (day: OpeningHourDayType, newValue: number[]) => {
    if (locked) {
      return;
    }

    onChange({
      ...value,
      [day]: {
        ...value[day],
        open: newValue[0],
        close: newValue[1],
      },
    });
  };

  const handleSwitchChange = (day: OpeningHourDayType, checked: boolean) => {
    if (locked) {
      return;
    }

    onChange({
      ...value,
      [day]: {
        ...value[day],
        is_closed: checked,
      },
    });
  };

  return (
    <Box width="100%">
      <Stack spacing={4} width="100%">
        {daysOfWeek.map((day) => {
          const { open, close, is_closed } = value[day] ?? {
            open: defaultOpen,
            close: defaultClose,
            is_closed: false,
          };

          return (
            <Box key={day} width="100%">
              <Typography variant="subtitle1" gutterBottom>
                {engDayToKor(day)}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={is_closed}
                      onChange={(e) => handleSwitchChange(day, e.target.checked)}
                      disabled={locked}
                    />
                  }
                  label="휴무"
                />

                <Box
                  sx={{
                    flex: 1,
                  }}
                >
                  <Slider
                    min={0}
                    max={24 * 60}
                    step={15}
                    disabled={locked}
                    value={[open, close]}
                    onChange={(_, val) => handleSliderChange(day, val as number[])}
                    valueLabelDisplay="on"
                    valueLabelFormat={(val) => formatTime(val)}
                  />
                </Box>
              </Box>
            </Box>
          );
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
