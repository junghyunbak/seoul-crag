import { Box } from '@mui/material';

import { Molecules } from '@/components/molecules';
import { CragThumbnailImages } from '@/components/CragThumbnailImages';

export function MapControlFooter() {
  return (
    <Box
      sx={(theme) => ({
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.mapControlFooter,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      })}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', p: 2 }}>
        <Molecules.GpsButton />
        <CragThumbnailImages />
      </Box>
    </Box>
  );
}
