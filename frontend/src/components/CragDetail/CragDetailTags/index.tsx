import { CragDetailContext } from '@/components/CragDetail/index.context';
import { TagList } from '@/components/TagList';
import { Box, Skeleton } from '@mui/material';
import { useContext } from 'react';

export function CragDetailTags() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {Array(3)
          .fill(null)
          .map(() => (
            <Skeleton variant="rounded" width={72} height={24} />
          ))}
      </Box>
    );
  }

  return <TagList tags={crag.gymTags.map(({ tag }) => tag)} readonly removePadding />;
}
