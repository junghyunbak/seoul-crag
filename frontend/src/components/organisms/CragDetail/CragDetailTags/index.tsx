import { useContext } from 'react';

import { Box, Skeleton } from '@mui/material';

import { Molecules } from '@/components/molecules';

import { CragDetailContext } from '../index.context';

export function CragDetailTags() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Skeleton variant="rounded" width={72} height={24} key={i} />
          ))}
      </Box>
    );
  }

  return <Molecules.TagList tags={crag.gymTags.map(({ tag }) => tag)} readonly removePadding />;
}
