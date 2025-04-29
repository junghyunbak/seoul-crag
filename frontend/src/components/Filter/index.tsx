import { Sheet } from 'react-modal-sheet';

import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import ShowerIcon from '@mui/icons-material/Shower';

import { useFetchCrags, useFilter, useModifyFilter } from '@/hooks';
import { zIndex } from '@/styles';

export function Filter() {
  const {
    isFilterSheetOpen,
    enableExceptionSettingFilter,
    enableShowerFilter,
    enableNewSettingFilter,
    enableTodayRemove,
    setEnableExceptionSettingFilter,
    setEnableShowerFilter,
    setEnableNewSettingFilter,
    setEnableTodayRemove,
    getFilteredCragCount,
  } = useFilter();
  const { updateIsFilterSheetOpen } = useModifyFilter();

  const { crags } = useFetchCrags();

  const handleShowButtonClick = () => {
    updateIsFilterSheetOpen(false);
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

  const handleNewSettingChipClick = () => {
    setEnableNewSettingFilter(enableNewSettingFilter ? null : true);
  };

  const handleTodayRemoveChipClick = () => {
    setEnableTodayRemove(enableTodayRemove ? null : true);
  };

  return (
    <Sheet
      isOpen={isFilterSheetOpen}
      onClose={handleSheetClose}
      snapPoints={[0.5]}
      initialSnap={0}
      style={{ zIndex: zIndex.filter }}
    >
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
            <Box sx={{ p: 2, pt: 0 }}>
              <Typography variant="subtitle1">암장 필터</Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">이용 가능</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <ShowerChip isSelect={!!enableShowerFilter} onClick={handleShowerChipClick} />
                  <NewSettingChip isSelect={!!enableNewSettingFilter} onClick={handleNewSettingChipClick} />
                  <TodayRemoveChip isSelect={!!enableTodayRemove} onClick={handleTodayRemoveChipClick} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">제한 사항</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <ExceptionSettingChip
                    isSelect={!!enableExceptionSettingFilter}
                    onClick={handleExceptionSettingChipClick}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{}}>
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <Button fullWidth variant="contained" onClick={handleShowButtonClick}>{`${getFilteredCragCount(
                crags
              )}개 암장 보기`}</Button>
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
      label="샤워실"
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
      label="세팅중"
      onClick={onClick}
      variant={isSelect ? 'filled' : 'outlined'}
    />
  );
}

export function NewSettingChip({ isSelect, onClick }: FilterChipProps) {
  return (
    <Chip
      icon={
        <Box sx={{ width: 21, height: 21, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography fontSize={'1.25rem'}>✨</Typography>
        </Box>
      }
      label="New 세팅"
      onClick={onClick}
      variant={isSelect ? 'filled' : 'outlined'}
    />
  );
}

export function TodayRemoveChip({ isSelect, onClick }: FilterChipProps) {
  return (
    <Chip
      icon={
        <Box sx={{ width: 21, height: 21, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography fontSize={'1.25rem'}>🍂</Typography>
        </Box>
      }
      label="오늘 탈거"
      onClick={onClick}
      variant={isSelect ? 'filled' : 'outlined'}
    />
  );
}
