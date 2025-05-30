import { CSSProperties } from 'react';

import { Typography } from '@mui/material';

import { useMap, useZoom } from '@/hooks';
import { useMarkerState } from '../_hooks/useMarkerState';

import { AnimatePresence, motion } from 'framer-motion';

interface MarkerTitleProps extends React.PropsWithChildren {
  marker: MyMarker | null;
  isSelect: boolean;
  fontWeight?: CSSProperties['fontWeight'];
}

export function MarkerTitle({ marker, isSelect, children, fontWeight = 'normal' }: MarkerTitleProps) {
  const { recognizer } = useMap();
  const { zoomLevel } = useZoom();
  const { isTitleShown } = useMarkerState({ marker, recognizer, isSelect, zoomLevel });

  return (
    <AnimatePresence>
      {isTitleShown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
