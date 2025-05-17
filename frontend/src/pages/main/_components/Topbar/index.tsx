import { MenuButton } from '@/components/MenuButton';
import { SearchInput } from '@/components/SearchInput';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Badge, Box, Button } from '@mui/material';
import { zIndex } from '@/styles';
import { Filter } from '@/components/Filter';
import { useFetchNotices } from '@/hooks';

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
            alignItems: 'flex-start',
            gap: 1,
            p: 2,
            pb: 0,
          }}
        >
          <Box sx={{ flex: 1, overflow: 'hidden', pb: '2px' }}>
            <SearchInput />
          </Box>
          <NoticeButton />
          <MenuButton />
        </Box>

        <Filter />
      </Box>
    </Box>
  );
}

function NoticeButton() {
  const { notices } = useFetchNotices(true);

  return (
    <Button
      sx={(theme) => ({
        background: theme.palette.common.white,
        p: 1.5,
        minWidth: 'auto',
        aspectRatio: '1/1',
        boxShadow: 1,
      })}
      onClick={() => {}}
    >
      <Badge badgeContent={notices?.length} color="error">
        <NotificationsNoneIcon />
      </Badge>
    </Button>
  );
}
