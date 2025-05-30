import { Avatar, AvatarGroup, Box, CircularProgress, IconButton, Typography } from '@mui/material';
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

  const isOpen = user !== undefined;

  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => {
        setSelectUserId(null);
      }}
      style={{ zIndex: zIndex.profile }}
      detent="content-height"
    >
      <Sheet.Container
        style={{
          overflow: 'hidden',
        }}
      >
        <Sheet.Content>
          <Box sx={{ mb: 2, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 80,
                background: '#93A667',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={(theme) => ({
                  width: 32,
                  height: 4,
                  borderRadius: 1,
                  background: theme.palette.grey[200],
                  position: 'absolute',
                  top: 8,
                })}
              />
            </Box>
            {user ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 2,
                    pt: '48px',
                    pb: 2,
                    px: 3,
                  }}
                >
                  <Avatar src={user.profile_image || ''} sx={{ width: 64, height: 64, border: '3px solid white' }}>
                    {user.username}
                  </Avatar>

                  <Box
                    sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {user.username}
                    </Typography>
                    <Typography component="span" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                      {`#${user.id.slice(0, 6)}`}
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

                <Typography variant="h6">기여한 암장</Typography>

                <AvatarGroup total={user.gymUserContributions.length}>
                  {user.gymUserContributions.map(({ gym }) => {
                    return <Avatar src={gym.thumbnail_url || ''}>{gym.name[0]}</Avatar>;
                  })}
                </AvatarGroup>
              </Box>
            ) : (
              <Box sx={{ p: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
