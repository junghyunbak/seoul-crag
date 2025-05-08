import Grid from '@mui/material/Grid';
import { useTheme, Typography } from '@mui/material';

import { format } from 'date-fns';

interface ScheduleWrapperProps extends React.PropsWithChildren {
  isRightCorner?: boolean;
  isLastLine?: boolean;
  isToday?: boolean;
  isHoliday?: boolean;
  date?: Date | null;
}

export function ScheduleWrapper({
  isRightCorner = false,
  isLastLine = false,
  isToday = false,
  children,
  date = null,
  isHoliday = false,
}: ScheduleWrapperProps) {
  const theme = useTheme();

  return (
    <Grid
      size={{ xs: 1 }}
      style={{
        borderRight: isRightCorner ? 'none' : '1px solid #ccc',
        borderBottom: isLastLine ? 'none' : '1px solid #ccc',
      }}
      sx={{
        height: 100,
        pt: 0.5,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {date && (
        <Typography
          align="center"
          variant="body2"
          sx={{
            background: isToday ? theme.palette.primary.main : undefined,
            borderRadius: isToday ? '50%' : undefined,
            color: (() => {
              if (isHoliday) {
                return theme.palette.error.main;
              }

              if (isToday) {
                return '#fff';
              }

              return '#000';
            })(),
            width: 24,
            aspectRatio: '1/1',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
          }}
        >
          {format(date, 'd')}
        </Typography>
      )}
      {children}
    </Grid>
  );
}
