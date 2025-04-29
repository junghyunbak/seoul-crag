import { Sheet } from 'react-modal-sheet';

import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import ShowerIcon from '@mui/icons-material/Shower';

import { useFetchCrags, useFilter, useModifyFilter } from '@/hooks';

export function Filter() {
  const {
    isFilterSheetOpen,
    enableExceptionSettingFilter,
    enableShowerFilter,
    setEnableExceptionSettingFilter,
    setEnableShowerFilter,
    showerFilter,
    exceptionSettingFilter,
  } = useFilter();
  const { updateIsFilterSheetOpen } = useModifyFilter();

  const { crags } = useFetchCrags();

  const filteredCragCount = (() => {
    if (!crags) {
      return 0;
    }

    return crags.filter(showerFilter).filter(exceptionSettingFilter).length;
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

  const handleExceptionSettingChipClick = () => {
    setEnableExceptionSettingFilter(enableExceptionSettingFilter ? null : true);
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
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                }}
              >
                <ShowerChip isSelect={!!enableShowerFilter} onClick={handleShowerChipClick} />
                <ExceptionSettingChip
                  isSelect={!!enableExceptionSettingFilter}
                  onClick={handleExceptionSettingChipClick}
                />
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

interface FilterChipProps {
  isSelect: boolean;
  onClick: () => void;
}

export function ShowerChip({ isSelect, onClick }: FilterChipProps) {
  return (
    <Chip
      icon={<ShowerIcon color="primary" />}
      label="샤워실 보유"
      variant={isSelect ? 'filled' : 'outlined'}
      onClick={onClick}
    />
  );
}

export function ExceptionSettingChip({ isSelect, onClick }: FilterChipProps) {
  return (
    <Chip
      icon={
        <Box sx={{ width: 21, height: 21, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography fontSize={'1.25rem'}>🚧</Typography>
        </Box>
      }
      label="세팅 제외"
      onClick={onClick}
      variant={isSelect ? 'filled' : 'outlined'}
    />
  );
}
