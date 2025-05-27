import { Box, Divider, Typography } from '@mui/material';
import { useContext } from 'react';
import { cragFormContext } from '../index.context';
import Grid from '@mui/material/Grid';
import { isAfter } from 'date-fns';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { DefaultError, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';

export function CragFeedField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const queryClient = useQueryClient();

  const clearCragsCache = () => {
    queryClient.invalidateQueries({ queryKey: ['crags'] });
  };

  const updateFeedReadStatus = useMutation<void, DefaultError, { feedId: string; isRead: boolean }>({
    mutationFn: async ({ feedId, isRead }) => {
      await api.patch(`/feeds/${feedId}`, {
        is_read: isRead,
      });
    },
  });

  return (
    <Box>
      <Divider />
      <Typography variant="h4" gutterBottom>
        인스타 피드
      </Typography>
      <Grid container spacing={2}>
        {(crag.feeds || [])
          .sort((a, b) => (isAfter(a.created_at, b.created_at) ? -1 : 1))
          .map((feed) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feed.id}>
              <Box sx={{ width: '100%', aspectRatio: '3/4', position: 'relative' }}>
                <Box
                  component="img"
                  src={feed.thumbnail_url}
                  sx={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                    filter: feed.is_read ? 'brightness(0.5)' : 'none',
                  }}
                />

                <Box
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0,
                    display: 'flex',
                    '& svg': {
                      width: '80%',
                      height: 'auto',
                      aspectRatio: '1/1',
                      color: 'white',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: '50%',
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      '&:hover': {
                        opacity: 1,
                      },
                      cursor: 'pointer',
                    }}
                    onClick={async () => {
                      await updateFeedReadStatus.mutateAsync({
                        feedId: feed.id,
                        isRead: !feed.is_read,
                      });

                      revalidateCrag();
                      clearCragsCache();
                    }}
                  >
                    {feed.is_read ? <CheckBoxIcon sx={{ fill: 'green' }} /> : <CheckBoxOutlineBlankIcon />}
                  </Box>
                  <Box
                    sx={{
                      height: '100%',
                      width: '50%',
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      '&:hover': {
                        opacity: 1,
                      },
                      cursor: 'pointer',
                    }}
                    onClick={async () => {
                      await updateFeedReadStatus.mutateAsync({
                        feedId: feed.id,
                        isRead: true,
                      });

                      window.open(feed.url, '_blank');

                      revalidateCrag();
                      clearCragsCache();
                    }}
                  >
                    <OpenInNewIcon />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
