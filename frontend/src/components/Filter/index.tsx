import { Sheet } from 'react-modal-sheet';

import { Box, Button, Divider, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';

import { useFetchCrags, useFilter, useModifyFilter } from '@/hooks';

import { zIndex } from '@/styles';

import { SelectExpeditionTime } from '@/components/Filter/SelectExpeditionTime';

export function Filter() {
  const {
    isOpenFilterSheet,

    isFilterNewSetting,
    isFilterNonSetting,
    isFilterShower,
    isFilterTodayRemove,

    getFilteredCragCount,
  } = useFilter();

  const {
    updateSelectDate,

    updateIsFilterSheetOpen,
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

  const handleNonSettingChipClick = () => {
    updateIsFilterNonSetting(!isFilterNonSetting);
  };

  const handleNewSettingChipClick = () => {
    updateIsFilterNewSetting(!isFilterNewSetting);
  };

  const handleTodayRemoveChipClick = () => {
    updateIsFilterTodayRemove(!isFilterTodayRemove);
  };

  const handleResetAllButtonClick = () => {
    updateIsFilterNewSetting(false);
    updateIsFilterNonSetting(false);
    updateIsFilterShower(false);
    updateIsFilterTodayRemove(false);
    updateSelectDate(null);
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

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="subtitle1">원정 날짜 선택</Typography>

              <SelectExpeditionTime />

              <Typography variant="caption" color="textSecondary">
                가려는 시간에 암장이 열려 있는지 미리 확인해보세요.
              </Typography>
            </Box>
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
                <Chip isSelect={isFilterShower} onClick={handleShowerChipClick} label="샤워실" emoji="🚿" />
                <Chip isSelect={isFilterNewSetting} onClick={handleNewSettingChipClick} label="New 세팅" emoji="✨" />
                <Chip
                  isSelect={isFilterTodayRemove}
                  onClick={handleTodayRemoveChipClick}
                  label="오늘 탈거"
                  emoji="🍂"
                />
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
                <Chip isSelect={isFilterNonSetting} onClick={handleNonSettingChipClick} label="세팅중" emoji="🚧" />
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
            <Button fullWidth variant="outlined" onClick={handleResetAllButtonClick}>
              초기화
            </Button>
            <Button fullWidth variant="contained" onClick={handleShowButtonClick}>{`${getFilteredCragCount(
              crags
            )}개 암장 보기`}</Button>
          </Box>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

interface ChipProps {
  isSelect: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
}

function Chip({ isSelect, onClick, label, emoji }: ChipProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: isSelect ? grey['600'] : 'transparent',
        cursor: 'pointer',
        py: 1,
        px: 2,
        borderRadius: 3,
        background: grey['100'],
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          width: 21,
          height: 21,

          fontSize: '1.5rem',
        }}
      >
        {emoji}
      </Box>

      <Typography fontSize={'1rem'}>{label}</Typography>
    </Box>
  );
}
