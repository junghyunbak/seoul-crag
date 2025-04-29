import { Badge, Button, Paper, Stack, Typography, styled, BadgeProps } from '@mui/material';

import ListIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import PersonIcon from '@mui/icons-material/PersonOutline';

import { useQueryParam, BooleanParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';
import { useFilter, useModifyCragList, useModifyFilter } from '@/hooks';

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
  );
}
