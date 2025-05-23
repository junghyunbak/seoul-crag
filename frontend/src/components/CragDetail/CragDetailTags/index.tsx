import { CragDetailContext } from '@/components/CragDetail/index.context';
import { TagList } from '@/components/TagList';
import { Box } from '@mui/material';
import { useContext } from 'react';

export function CragDetailTags() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
      }}
    >
      <TagList tags={crag.gymTags.map(({ tag }) => tag)} readonly removePadding />
    </Box>
  );
}
