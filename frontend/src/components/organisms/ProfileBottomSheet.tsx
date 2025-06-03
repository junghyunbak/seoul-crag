import { Box, CircularProgress } from '@mui/material';

import { zIndex } from '@/styles';

import { Sheet } from 'react-modal-sheet';

import { useFetchMe, useFetchUser, useModifyProfile, useProfile } from '@/hooks';

import { Molecules } from '@/components/molecules';

export function ProfileBottomSheet() {
  const { selectUserId } = useProfile();
  const { user } = useFetchUser(selectUserId);
  const { user: me } = useFetchMe();

  const { updateSelectUserId } = useModifyProfile();

  const isOpen = (() => {
    if (user === undefined) {
      return false;
    }

    if (user === null) {
      return false;
    }

    return true;
  })();

  return (
    <Sheet
      isOpen={isOpen}
      onClose={() => {
        updateSelectUserId(null);
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
              <Molecules.UserProfile user={user} me={me} />
            ) : (
              <Box sx={{ p: 2 }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
}
