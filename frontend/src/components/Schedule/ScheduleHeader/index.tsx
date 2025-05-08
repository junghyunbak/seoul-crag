import { Typography } from '@mui/material';
import { DAY_LABELS } from '@/constants';
import Grid from '@mui/material/Grid';

export function ScheduleHeader() {
  return (
    <>
      {DAY_LABELS.map((label, i) => (
        <Grid size={{ xs: 1 }} key={label} sx={{ borderRight: i === 6 ? 'none' : '1px solid #ccc' }}>
          <Typography align="center" fontWeight={600} sx={{ color: i === 0 ? 'error.main' : undefined }}>
            {label}
          </Typography>
        </Grid>
      ))}
    </>
  );
}
