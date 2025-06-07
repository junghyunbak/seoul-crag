import { DAY_LABELS } from '@/constants';
import { Box, Button } from '@mui/material';

interface DayPickerProps {
  currentDay: number;
  onChange: (day: number) => void;
}

export function DayPicker({ currentDay, onChange }: DayPickerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
      }}
    >
      {Array(7)
        .fill(null)
        .map((_, i) => {
          const isSelect = i === currentDay;

          return (
            <Button
              key={i}
              variant={isSelect ? 'contained' : 'outlined'}
              disabled={isSelect}
              onClick={() => {
                onChange(i);
              }}
            >
              {DAY_LABELS[i]}
            </Button>
          );
        })}
    </Box>
  );
}
