import { Badge, Box, Typography, styled, BadgeProps } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';

import { useExp, useFilter, useModifyFilterSheet, useTag } from '@/hooks';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 2,
    top: 4,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export function FilterButton() {
  const { exp, isExpSelect } = useExp();
  const { filter } = useFilter();
  const { selectTagId } = useTag();

  const { updateIsFilterBottomSheetOpen } = useModifyFilterSheet();

  const appliedFilterCount = (() => {
    let cnt = 0;

    cnt += Array.from(Object.values(filter)).reduce((a, c) => a + (typeof c === 'boolean' && c ? 1 : 0), 0);

    cnt += Array.from(Object.values(selectTagId)).reduce((a, c) => a + (typeof c === 'string' ? 1 : 0), 0);

    cnt += isExpSelect ? 1 : 0;

    return cnt;
  })();

  return (
    <Box
      sx={{ display: 'flex', p: 1.5, width: '100%', gap: 2, cursor: 'pointer' }}
      onClick={() => {
        updateIsFilterBottomSheetOpen(true);
      }}
    >
      <StyledBadge badgeContent={appliedFilterCount} color="info">
        <TuneIcon />
      </StyledBadge>
      <Typography>
        <Typography component="span" sx={(theme) => ({ color: theme.palette.primary.main, fontWeight: 500 })}>
          {format(exp.date, 'M월 dd일 (E) a h:mm', { locale: ko })}
        </Typography>{' '}
        이용
      </Typography>
    </Box>
  );
}
