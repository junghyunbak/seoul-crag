import { MenuButton } from '@/components/MenuButton';
import { SearchInput } from '@/components/SearchInput';
import { Box } from '@mui/material';
import { zIndex } from '@/styles';

export function Topbar() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: zIndex.topbar,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'sm',
          display: 'flex',
          gap: 1,
          p: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <SearchInput />
        </Box>
        <MenuButton />
      </Box>
    </Box>
  );
}
