import { Box, Typography } from '@mui/material';
import { useMarkerState } from '../_hooks/useMarkerState';
import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { useZoom } from '@/hooks';
import { CSSProperties } from 'react';

interface MarkerTitleProps extends React.PropsWithChildren {
  marker: MyMarker | null;
  isSelect: boolean;
  fontWeight?: CSSProperties['fontWeight'];
}

export function MarkerTitle({ marker, isSelect, children, fontWeight = 'normal' }: MarkerTitleProps) {
  const [recognizer] = useStore(useShallow((s) => [s.recognizer]));

  const { zoomLevel } = useZoom();

  const { isTitleShown } = useMarkerState({ marker, recognizer, isSelect, zoomLevel });

  if (!isTitleShown) {
    return null;
  }

  return (
    <Box
      sx={{
        /**
         * position: absolute가 아니면 전체 크기가 커져서 translate가 망가짐.
         */
        position: 'absolute',
        transform: `translate(-50%, ${isSelect ? 0 : 50}%)`,
      }}
    >
      <Typography
        sx={{
          textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
          fontWeight,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
