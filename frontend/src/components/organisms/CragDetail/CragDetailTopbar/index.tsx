import { useContext } from 'react';

import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { CragDetailContext } from '../index.context';

import { zIndex } from '@/styles';

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
        p: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: isScrolled ? 'white' : 'transparent',
        boxShadow: isScrolled ? 1 : 0,
        zIndex: zIndex.stickyHeader,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <IconButton sx={{ color: isScrolled ? 'black' : 'white' }} onClick={onClose}>
          <ArrowBackIosNewIcon />
        </IconButton>

        {isScrolled && (
          <Box
            sx={{
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {crag?.name}
            </Typography>
          </Box>
        )}
      </Box>

      <IconButton sx={{ color: isScrolled ? 'black' : 'white' }} onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Box>
  );
}
