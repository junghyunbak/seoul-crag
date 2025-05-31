import { CragDetailContext } from '@/components/CragDetail/index.context';
import { Skeleton, Typography } from '@mui/material';

import { useContext } from 'react';

export function CragDetailArea() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return <Skeleton variant="text" sx={{ fontSize: '0.75rem' }} />;
  }

  return (
    <Typography variant="caption" color="text.secondary">
      {`암장 크기 · ${crag.area ? `약 ${crag.area}평` : '(알려지지 않음)'}`}
    </Typography>
  );
}
