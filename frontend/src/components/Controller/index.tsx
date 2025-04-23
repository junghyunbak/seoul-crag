import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { Tune } from '@mui/icons-material';
import { Search } from '@mui/icons-material';
import { Menu } from '@mui/icons-material';
import { useModifyMenu } from '@/hooks';
import { useLocation } from 'react-router';

export function Controller() {
  const { updateIsMenuOpen } = useModifyMenu();

  const { search } = useLocation();

  const handleMenuButtonClick = () => {
    updateIsMenuOpen(true, new URLSearchParams(search));
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '10%',
      }}
    >
      <Paper sx={{ borderRadius: '0.5rem', width: '90dvw', maxWidth: '400px', p: '1rem', background: '#f4f2ef' }}>
        <Stack direction="row" justifyContent="space-around" sx={{ width: '100%' }}>
          <Button sx={{ display: 'flex', gap: '0.5rem', color: '#5f6161' }}>
            <Tune sx={{ width: '2rem', height: '2rem' }} />
            <Typography>필터</Typography>
          </Button>
          <Button sx={{ display: 'flex', gap: '0.5rem', color: '#5f6161' }}>
            <Search sx={{ width: '2rem', height: '2rem' }} />
            <Typography>검색</Typography>
          </Button>
          <Button sx={{ display: 'flex', gap: '0.5rem', color: '#5f6161' }} onClick={handleMenuButtonClick}>
            <Menu sx={{ width: '2rem', height: '2rem' }} />
            <Typography>메뉴</Typography>
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
