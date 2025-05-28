import React from 'react';
import { MarkerIcon } from '../Map/overlays/markers/_assets/MarkerIcon';
import { Box } from '@mui/material';

interface CragIconProps {
  width: number;
  isSelect?: boolean;
  isClose?: boolean;
  isRect?: boolean;
  isUnique?: boolean;
}

export function CragIcon({ width, isSelect = false, isClose = false, isRect = false, isUnique }: CragIconProps) {
  const brightness = (() => {
    let brightness = 1;

    if (isUnique) {
      brightness += 0.2;
    }

    return `brightness(${brightness})`;
  })();

  const grayscale = (() => {
    return `grayscale(${isClose ? 1 : 0})`;
  })();

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        filter: `${brightness} ${grayscale}`,
      }}
    >
      {isSelect ? (
        <MarkerIcon.Active width={width} />
      ) : isRect ? (
        <MarkerIcon.Inactive.Square width={width} />
      ) : (
        <MarkerIcon.Inactive.Circle width={width} />
      )}
    </Box>
  );
}
