import { GpsButton } from '@/components/GpsButton';
import { NoticeMarquee } from '@/components/NoticeMarquee';
import { zIndex } from '@/styles';
import { Box } from '@mui/material';
import { CragThumbnailImages } from '@/components/CragThumbnailImages';

export function Footer() {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: 0,
        right: 0,
        zIndex: zIndex.footer,
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', p: 2 }}>
        <GpsButton />
        <CragThumbnailImages />
      </Box>
      <NoticeMarquee />
    </Box>
  );
}
