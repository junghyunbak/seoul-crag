import { Box, Typography } from '@mui/material';

import { SCHEDULE_TYPE_TO_COLORS, SCHEDULE_TYPE_TO_LABELS } from '@/constants';

interface ScheduleElementRecordProps {
  schedule: Schedule;
  leftPer: number;
  rightPer: number;
  isFirst?: boolean;
  isLast?: boolean;
  readonly?: boolean;
  onClick?: () => void;
}

export function ScheduleElementRecord({
  schedule,
  leftPer,
  rightPer,
  isFirst = false,
  isLast = false,
  readonly = false,
  onClick = () => {},
}: ScheduleElementRecordProps) {
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
      }}
    >
      <Box sx={{ width: `${leftPer}%` }} />

      <Box
        sx={{
          width: '100%',

          px: { md: 1, xs: 0.5 },
          py: 0.2,
        }}
        style={{
          backgroundColor: SCHEDULE_TYPE_TO_COLORS[schedule.type],
          borderTopLeftRadius: isFirst ? 4 : 0,
          borderBottomLeftRadius: isFirst ? 4 : 0,
          borderTopRightRadius: isLast ? 4 : 0,
          borderBottomRightRadius: isLast ? 4 : 0,
          cursor: readonly ? 'default' : 'pointer',
        }}
        onClick={onClick}
      >
        <Typography
          sx={{
            color: 'white',
            fontSize: { md: 12, xs: 8 },
          }}
        >
          {SCHEDULE_TYPE_TO_LABELS[schedule.type]}
        </Typography>
      </Box>

      <Box sx={{ width: `${rightPer}%` }} />
    </Box>
  );
}
