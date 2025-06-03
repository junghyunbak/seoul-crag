import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { format } from 'date-fns';

interface CalendarMonthControllerProps {
  currentMonth: Date;
  onPrev: () => void;
  onNext: () => void;
  readonly?: boolean;
  fontColor?: string;
}

export function CalendarMonthController({
  currentMonth,
  onPrev,
  onNext,
  readonly = false,
  fontColor,
}: CalendarMonthControllerProps) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      {!readonly && (
        <IconButton onClick={onPrev}>
          <ChevronLeftIcon />
        </IconButton>
      )}
      <Typography variant="h6" sx={{ color: fontColor || 'black' }}>
        {format(currentMonth, 'yyyy년 M월')}
      </Typography>
      {!readonly && (
        <IconButton onClick={onNext}>
          <ChevronRightIcon />
        </IconButton>
      )}
    </Box>
  );
}
