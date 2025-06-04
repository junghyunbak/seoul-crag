import React from 'react';

import { Box } from '@mui/material';

import { useMap, useZoom } from '@/hooks';
import { useMarkerState } from '../_hooks/useMarkerState';

import { AnimatePresence, motion } from 'framer-motion';

import { Atoms } from '@/components/atoms';

import { SIZE } from '@/constants';

interface MarkerTitleProps extends React.PropsWithChildren {
  marker: MyMarker | null;
  isSelect: boolean;
  label: string;
  markerWidth: number;
}

const tolerance = SIZE.TOLERANCE;

export function MarkerTitle({ marker, isSelect, children, label, markerWidth }: MarkerTitleProps) {
  const { recognizer } = useMap();
  const { zoomLevel } = useZoom();
  const { isTitleShown } = useMarkerState({ marker, recognizer, isSelect, zoomLevel });

  let saleInfo: React.ReactNode | null = null;

  const z = (markerWidth * 0.6) / 2;

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
            zIndex: -1,
            transform: `translate(-50%, -50%)`,
            width: tolerance * 2,
            height: tolerance * 2,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',

            //background: 'red',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: `calc(50% - ${isSelect ? z : 0}px)`,
              py: `${z}px`,
              height: tolerance * 2,
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 0.5,

                //background: 'blue',
                //opacity: 0.5,
              }}
            >
              <Atoms.Text.Halo>{label}</Atoms.Text.Halo>

              {saleInfo}
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

MarkerTitle.SaleInfo = function SaleInfo({ children }: { children: React.ReactNode }) {
  return <Box>{children}</Box>;
};
