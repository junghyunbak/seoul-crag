import { Avatar, Box, CircularProgress, Divider, IconButton, Typography } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import { urlService } from '@/utils';

import { zIndex } from '@/styles';

import { Sheet } from 'react-modal-sheet';
import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { useFetchMe, useFetchUser } from '@/hooks';
import { QUERY_STRING } from '@/constants';
import { useQueryParam, StringParam } from 'use-query-params';

export function ProfileBottomSheet() {
  const [selectUserId, setSelectUserId] = useStore(useShallow((s) => [s.selectUserId, s.setSelectUserId]));
  const [, setSelectCragDetailId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);

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
          <Box sx={{ mb: 2 }}>
            {user ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, px: 3 }}>
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

                <Divider />

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    py: 2,
                    px: 3,
                  }}
                >
                  <Typography variant="h6">암장 기여 횟수</Typography>
                  <Typography variant="h4">{user.gymUserContributions.length}</Typography>
                </Box>

                {user?.gymUserContributions.length > 0 && (
                  <>
                    <Divider />
                    <Box sx={{ py: 2, px: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="h6">기여 목록</Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {user.gymUserContributions.map(({ gym, contribution }) => {
                          return (
                            <li>
                              {`${contribution.name}: `}
                              <Typography
                                component="span"
                                sx={(theme) => ({
                                  color: theme.palette.primary.main,
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                })}
                                onClick={() => {
                                  setSelectCragDetailId(gym.id);
                                }}
                              >
                                {gym.name}
                              </Typography>
                            </li>
                          );
                        })}
                      </Box>
                    </Box>
                  </>
                )}
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
