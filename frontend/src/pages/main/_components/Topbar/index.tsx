import { MenuButton } from '@/components/MenuButton';
import { SearchInput } from '@/components/SearchInput';
import { Box, Paper } from '@mui/material';
import { zIndex } from '@/styles';
import { NoticeButton } from '@/components/NoticeButton';
import { FilterButton } from '@/components/FilterButton';

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
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 'sm',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            p: 2,
          }}
        >
          <Paper
            sx={{
              pointerEvents: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box sx={{ flex: 1, overflow: 'hidden', pb: '2px' }}>
                <SearchInput />
              </Box>

              <Box
                sx={{
                  flexShrink: 0,
                  px: 0.5,
                }}
              >
                <NoticeButton />
                <MenuButton />
              </Box>
            </Box>

            <FilterButton />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
