import { MenuButton } from '@/components/MenuButton';
import { SearchInput } from '@/components/SearchInput';
import { Box } from '@mui/material';
import { zIndex } from '@/styles';
import { Filter } from '@/components/Filter';

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
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'sm',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          pointerEvents: 'auto',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: 1,
            p: 2,
            pb: 0,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <SearchInput />
          </Box>
          <MenuButton />
        </Box>

        <Filter />
      </Box>
    </Box>
  );
}
