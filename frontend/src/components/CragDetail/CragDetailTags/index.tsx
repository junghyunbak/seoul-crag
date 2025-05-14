import { CragDetailContext } from '@/components/CragDetail/index.context';
import { Box, Chip } from '@mui/material';
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
      {(crag.tags || []).map((tag) => {
        return <Chip key={tag.id} label={tag.name} size="small" variant="outlined" />;
      })}
    </Box>
  );
}
