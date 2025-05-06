import { useContext } from 'react';

import { Typography } from '@mui/material';

import { CragDetailContext } from '@/components/CragDetail/index.context';

export function CragDetailTitle() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
  }

  return (
    <Typography variant="h5" fontWeight={600}>
      {crag.name}
    </Typography>
  );
}
