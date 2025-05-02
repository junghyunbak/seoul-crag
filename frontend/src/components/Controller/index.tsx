import { Box, Badge, Button, Paper, Stack, Typography, styled, BadgeProps, IconButton } from '@mui/material';

import ListIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import PersonIcon from '@mui/icons-material/PersonOutline';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';

import { useQueryParam, BooleanParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';
import { useFetchImages, useFilter, useModifyCragList, useModifyFilter } from '@/hooks';
import { useStore } from '@/store';

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': {
    right: 3,
    top: 3,
    border: `2px solid #f4f2ef`,
    padding: '0 4px',
  },
}));

export function Controller() {
  const [, setIsMenuOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  const { updateIsFilterSheetOpen } = useModifyFilter();
  const { updateIsCragListModalOpen } = useModifyCragList();

  const { filterCount } = useFilter();

  const handleManageButtonClick = () => {
    setIsMenuOpen(true);
  };

  const handleFilterButtonClick = () => {
    updateIsFilterSheetOpen(true);
  };

  const handleCragListOpenButtonClick = () => {
    updateIsCragListModalOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
        <Paper
          sx={{
            background: '#f4f2ef',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40,
          }}
        >
          <IconButton
            onClick={() => {
              const { setGpsLatLng } = useStore.getState();

              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                  const {
                    coords: { latitude, longitude },
                  } = position;

                  setGpsLatLng(latitude, longitude);
                });
              }
            }}
          >
            <GpsFixedIcon />
          </IconButton>
        </Paper>
        <CragThumbnailImages />
      </Box>

      <Paper sx={{ borderRadius: '0.5rem', width: '90dvw', maxWidth: '400px', p: '1rem', background: '#f4f2ef' }}>
        <Stack direction="row" justifyContent="space-around" sx={{ width: '100%' }}>
          <Button sx={{ display: 'flex', gap: '0.5rem', color: '#5f6161' }} onClick={handleFilterButtonClick}>
            <StyledBadge badgeContent={filterCount} color="primary">
              <TuneIcon sx={{ width: '2rem', height: '2rem', transform: 'scaleX(-1)' }} />
            </StyledBadge>
            <Typography>필터</Typography>
          </Button>
          <Button sx={{ display: 'flex', gap: '0.5rem', color: '#5f6161' }} onClick={handleCragListOpenButtonClick}>
            <ListIcon sx={{ width: '2rem', height: '2rem' }} />
            <Typography>목록</Typography>
          </Button>
          <Button sx={{ display: 'flex', gap: '0.5rem', color: '#5f6161' }} onClick={handleManageButtonClick}>
            <PersonIcon sx={{ width: '2rem', height: '2rem' }} />
            <Typography>관리</Typography>
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

function CragThumbnailImages() {
  const [selectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);
  const [, setInteriorStory] = useQueryParam(QUERY_STRING.STORY_INTERIOR, StringParam);

  const { images } = useFetchImages(selectCragId, 'interior');

  if (!images || images.length === 0) {
    return;
  }

  return (
    <Box
      component="img"
      src={images[0].url}
      sx={{
        width: '120px',
        aspectRatio: '2/1',
        objectFit: 'cover',
        border: '1px solid white',
        boxShadow: 2,
        cursor: 'pointer',
      }}
      onClick={() => {
        setInteriorStory(selectCragId);
      }}
    />
  );
}
