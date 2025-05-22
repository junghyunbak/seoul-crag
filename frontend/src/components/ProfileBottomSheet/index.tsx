import { Avatar, Box, IconButton, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import { urlService } from '@/utils';

import { zIndex } from '@/styles';

import { Sheet } from 'react-modal-sheet';
import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { useFetchMe, useFetchUser } from '@/hooks';

export function ProfileBottomSheet() {
  const [selectUserId, setSelectUserId] = useStore(useShallow((s) => [s.selectUserId, s.setSelectUserId]));

  const { user } = useFetchUser(selectUserId);
  const { user: me } = useFetchMe();

  const isOpen = user !== null;

  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => {
        setSelectUserId(null);
      }}
      style={{ zIndex: zIndex.profile }}
      detent="content-height"
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
              <Avatar src={user.profile_image || ''}>{user.username}</Avatar>
              <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.username}
                    <Typography component="span" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                      {`#${user.id.slice(0, 6)}`}
                    </Typography>
                  </Typography>
                  {user.id === me?.id && (
                    <IconButton
                      size="small"
                      onClick={() => (window.location.href = urlService.getAbsolutePath('/manage'))}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
