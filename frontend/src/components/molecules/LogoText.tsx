import { Box, Typography } from '@mui/material';

export function LogoText({ onClick = () => {} }: { onClick?: () => void }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        cursor: 'pointer',
      }}
    >
      <Typography variant="h5" sx={{ color: 'black', textDecoration: 'none' }}>
        서울암장
      </Typography>
    </Box>
  );
}
