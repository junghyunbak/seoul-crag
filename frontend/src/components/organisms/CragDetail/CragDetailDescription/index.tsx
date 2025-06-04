import { Typography } from '@mui/material';

import { useContext } from 'react';

import { CragDetailContext } from '../index.context';

export function CragDetailDescription() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
  }

  return (
    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }} component="pre">
      {crag.description}
    </Typography>
  );
}
