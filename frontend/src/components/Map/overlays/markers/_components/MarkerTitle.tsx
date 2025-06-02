import React from 'react';

import { Box, styled, Typography } from '@mui/material';

import { useMap, useZoom } from '@/hooks';
import { useMarkerState } from '../_hooks/useMarkerState';

import { AnimatePresence, motion } from 'framer-motion';

interface MarkerTitleProps extends React.PropsWithChildren {
  marker: MyMarker | null;
  isSelect: boolean;
  label: string;
}

export function MarkerTitle({ marker, isSelect, children, label }: MarkerTitleProps) {
  const { recognizer } = useMap();
  const { zoomLevel } = useZoom();
  const { isTitleShown } = useMarkerState({ marker, recognizer, isSelect, zoomLevel });

  let saleInfo: React.ReactNode | null = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === MarkerTitle.SaleInfo) {
      saleInfo = child;
    }
  });

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
            transform: `translate(-50%, ${5 + (isSelect ? 0 : 10)}px)`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <HaloText>{label}</HaloText>

            {saleInfo}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

MarkerTitle.SaleInfo = function SaleInfo({ children }: { children: React.ReactNode }) {
  return <Box>{children}</Box>;
};

export const HaloText = styled(Typography)({
  textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
  lineHeight: 1,
  textAlign: 'center',
  fontWeight: 'bold',
});
