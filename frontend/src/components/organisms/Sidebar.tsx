import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';

import { useQueryParam, BooleanParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';
import { Atoms } from '@/components/atoms';
import { Molecules } from '@/components/molecules';

export function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isOpen, setIsOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  const open = Boolean(isOpen);

  const handleClose = () => {
    setIsOpen(null);
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} sx={{ zIndex: theme.zIndex.sidebar, userSelect: 'none' }}>
      <Box sx={{ width: isMobile ? '80vw' : 360, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2 }}>
          <Atoms.Text.Title variant="h3">서울암장</Atoms.Text.Title>
        </Box>

        {/**
         * menu
         */}
        <Molecules.UserMenu />

        <Box sx={{ flexGrow: 1 }} />

        {/**
         * options
         */}
        <Box sx={{ p: 2 }}>
          <Molecules.MapOptions />
        </Box>
      </Box>
    </Drawer>
  );
}
