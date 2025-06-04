import { useContext } from 'react';

import { Skeleton, Typography } from '@mui/material';

import { CragDetailContext } from '../index.context';

export function CragDetailTitle() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return <Skeleton sx={{ fontSize: '1.5rem' }} />;
  }

  return (
    <Typography variant="h5" fontWeight={600}>
      {crag.name}
    </Typography>
  );
}
