import { useContext } from 'react';

import { Box, Typography, IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';

import { CragDetailContext } from '@/components/CragDetail/index.context';

interface CragDetailTopbarProps {
  isScrolled: boolean;
}

export function CragDetailTopbar({ isScrolled }: CragDetailTopbarProps) {
  const { crag, onClose } = useContext(CragDetailContext);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        py: 1,
        pl: 2,
        pr: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isScrolled ? 'white' : 'transparent',
        boxShadow: isScrolled ? 1 : 0,
        zIndex: 1,
      }}
    >
      <Box>{isScrolled && <Typography variant="h6">{crag?.name}</Typography>}</Box>

      <IconButton sx={{ color: isScrolled ? 'black' : 'white' }} onClick={onClose}>
        <Close />
      </IconButton>
    </Box>
  );
}
