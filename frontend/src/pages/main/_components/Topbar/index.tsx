import { Box } from '@mui/material';

import { zIndex } from '@/styles';

import { Organisms } from '@/components/organisms';

export function Topbar() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: zIndex.topbar,
        display: 'flex',
        justifyContent: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'sm',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
          }}
        >
          <Box sx={{ pointerEvents: 'auto' }}>
            <Organisms.MapControlBar />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
