import { useLocation } from 'react-router';

import { Slider } from '@mui/material';
import { Box, Button, Stack, Typography } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Sheet } from 'react-modal-sheet';

import {
  useSelectDate,
  useCrag,
  useExerciseTimeRange,
  useModifyExerciseTimeRange,
  useModifyFilter,
  useModifySelectDate,
  useFilter,
} from '@/hooks';

import { time } from '@/utils';

import { TIME } from '@/constants';

import dayjs, { Dayjs } from 'dayjs';

export function Filter() {
  const { selectDate } = useSelectDate();
  const { isFilterSheetOpen } = useFilter();
  const { exerciseTimeRange, isUseAllTime } = useExerciseTimeRange();
  const { search } = useLocation();
  const { openCragCount } = useCrag(selectDate ? dayjs(selectDate) : null, exerciseTimeRange);

  const { updateSelectDate } = useModifySelectDate();
  const { updateIsFilterSheetOpen } = useModifyFilter();
  const { updateExerciseTimeRange } = useModifyExerciseTimeRange();

  const handleShowButtonClick = () => {
    updateIsFilterSheetOpen(false);
  };

  const handleBottomSheetDismiss = () => {
    updateIsFilterSheetOpen(false);
  };

  const handleTimeRangeResetButtonClick = () => {
    updateExerciseTimeRange([TIME.DEFAULT_START_TIME, TIME.DEFAULT_END_TIME], new URLSearchParams(search));
  };

  const handleDateChange = (date: Dayjs) => {
    const isSameDate = selectDate?.isSame(date);

    updateSelectDate(isSameDate ? null : date, new URLSearchParams(search));

    if (document.activeElement instanceof HTMLElement && isSameDate) {
      document.activeElement.blur();
    }
  };

  const handleRangeSliderChange = (event: Event, newRange: number[]) => {
    const [start, end] = newRange;
    updateExerciseTimeRange([start, end], new URLSearchParams(search));
  };

  return (
    <Sheet isOpen={isFilterSheetOpen} onClose={handleBottomSheetDismiss} detent="content-height">
      <Sheet.Backdrop onTap={handleBottomSheetDismiss} />
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag>
          <Box
            sx={{
              width: '100%',
              p: '1rem',
            }}
          >
            <Stack gap="0.5rem">
              <Typography
                sx={{
                  fontSize: '2rem',
                }}
              >
                🧗 원정 가는 날?
              </Typography>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar value={selectDate} onChange={handleDateChange} />
              </LocalizationProvider>

              <Stack direction="row" alignItems="center" gap="1rem">
                <Typography
                  sx={{
                    fontSize: '2rem',
                  }}
                >
                  ⌚️ 운동 시간?
                </Typography>

                <Button onClick={handleTimeRangeResetButtonClick}>초기화</Button>
              </Stack>

              <Typography>
                {isUseAllTime
                  ? '상관 없음'
                  : `${time.convert24ToCustom12HourFormat(exerciseTimeRange[0])} ~ ${time.convert24ToCustom12HourFormat(
                      exerciseTimeRange[1]
                    )}`}
              </Typography>

              <Box
                sx={{
                  p: '0 24px',
                }}
              >
                <Slider
                  value={exerciseTimeRange}
                  onChange={handleRangeSliderChange}
                  max={24}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => time.convert24ToCustom12HourFormat(value)}
                  disabled={selectDate === null}
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleShowButtonClick}
                sx={{
                  fontSize: '1rem',
                }}
              >
                {selectDate ? `운영중인 ${openCragCount}개 암장 보기` : '전국 암장 보기'}
              </Button>
            </Stack>
          </Box>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
