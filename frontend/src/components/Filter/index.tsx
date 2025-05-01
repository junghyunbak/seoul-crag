import { Sheet } from 'react-modal-sheet';

import { Box, Button, Chip, Divider, IconButton, TextField, Typography } from '@mui/material';
import ShowerIcon from '@mui/icons-material/Shower';
import DeleteIcon from '@mui/icons-material/Delete';

import { useFetchCrags, useFilter, useModifyFilter } from '@/hooks';

import { zIndex } from '@/styles';

import { format, parse } from 'date-fns';

export function Filter() {
  const {
    isOpenFilterSheet,

    isFilterNewSetting,
    isFilterNonSetting,
    isFilterShower,
    isFilterTodayRemove,

    YYYYMMDDToday,

    selectDate,

    getFilteredCragCount,
  } = useFilter();

  const {
    updateIsFilterSheetOpen,
    updateSelectDate,
    updateIsFilterNewSetting,
    updateIsFilterNonSetting,
    updateIsFilterShower,
    updateIsFilterTodayRemove,
  } = useModifyFilter();

  const { crags } = useFetchCrags();

  const handleShowButtonClick = () => {
    updateIsFilterSheetOpen(false);
  };

  const handleSheetClose = () => {
    updateIsFilterSheetOpen(false);
  };

  const handleShowerChipClick = () => {
    updateIsFilterShower(!isFilterShower);
  };

  const handleExceptionSettingChipClick = () => {
    updateIsFilterNonSetting(!isFilterNonSetting);
  };

  const handleNewSettingChipClick = () => {
    updateIsFilterNewSetting(!isFilterNewSetting);
  };

  const handleTodayRemoveChipClick = () => {
    updateIsFilterTodayRemove(!isFilterTodayRemove);
  };

  return (
    <Sheet
      isOpen={isOpenFilterSheet}
      onClose={handleSheetClose}
      detent="content-height"
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
              <Typography variant="h6">암장 필터</Typography>
            </Box>

            <Divider />

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle1">이용 가능</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <ShowerChip isSelect={isFilterShower} onClick={handleShowerChipClick} />
                  <NewSettingChip isSelect={isFilterNewSetting} onClick={handleNewSettingChipClick} />
                  <TodayRemoveChip isSelect={isFilterTodayRemove} onClick={handleTodayRemoveChipClick} />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle1">제한 사항</Typography>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <ExceptionSettingChip isSelect={isFilterNonSetting} onClick={handleExceptionSettingChipClick} />
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1">원정 날짜 선택</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  type="date"
                  value={format(selectDate || new Date(), 'yyyy-MM-dd')}
                  slotProps={{
                    htmlInput: {
                      min: format(new Date(), 'yyyy-MM-dd'),
                    },
                  }}
                  onChange={(e) => {
                    const date = e.target.value;

                    if (!date || date === YYYYMMDDToday) {
                      updateSelectDate(null);
                      return;
                    }

                    updateSelectDate(parse(e.target.value, 'yyyy-MM-dd', new Date()));
                  }}
                />
                {selectDate && (
                  <IconButton onClick={() => updateSelectDate(null)}>
                    <DeleteIcon />
                  </IconButton>
                )}
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
