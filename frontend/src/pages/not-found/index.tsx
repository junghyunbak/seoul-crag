import { Stack, Typography } from '@mui/material';

export default function NotFound() {
  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
      <Typography sx={{ fontSize: '8rem' }}>404</Typography>
    </Stack>
  );
}
