import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import { Sheet } from 'react-modal-sheet';
import ShowerIcon from '@mui/icons-material/Shower';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';
import { useFetchCrags, useFilter, useModifyFilter } from '@/hooks';

export function Filter() {
  const { isFilterSheetOpen } = useFilter();
  const { updateIsFilterSheetOpen } = useModifyFilter();

  const [enableShowerFilter, setEnableShowerFilter] = useQueryParam(QUERY_STRING.FILTER_SHOWER, BooleanParam);
  const { crags } = useFetchCrags();

  const filteredCragCount = (() => {
    if (!crags) {
      return 0;
    }

    const showerFilter = enableShowerFilter
      ? (crag: Crag) => {
          return crag.imageTypes?.includes('shower');
        }
      : () => {
          return true;
        };

    return crags.filter(showerFilter).length;
  })();

  const handleShowButtonClick = () => {
    updateIsFilterSheetOpen(false);
  };

  const handleResetFilterButtonClick = () => {
    setEnableShowerFilter(null);
  };

  const handleSheetClose = () => {
    updateIsFilterSheetOpen(false);
  };

  const handleShowerChipClick = () => {
    setEnableShowerFilter(enableShowerFilter ? null : true);
  };

  return (
    <Sheet isOpen={isFilterSheetOpen} onClose={handleSheetClose}>
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle1">암장 필터</Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2">속성</Typography>
              <Box>
                <ShowerChip isSelect={!!enableShowerFilter} onClick={handleShowerChipClick} />
              </Box>
            </Box>
          </Box>

          <Box sx={{}}>
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <Button fullWidth variant="outlined" onClick={handleResetFilterButtonClick}>
                초기화
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={handleShowButtonClick}
              >{`${filteredCragCount}개 암장 보기`}</Button>
            </Box>
          </Box>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

interface ShowerChipProps {
  isSelect: boolean;
  onClick: () => void;
}

export function ShowerChip({ isSelect, onClick }: ShowerChipProps) {
  return (
    <Chip
      icon={<ShowerIcon color="primary" />}
      label="샤워실"
      variant={isSelect ? 'filled' : 'outlined'}
      onClick={onClick}
    />
  );
}
