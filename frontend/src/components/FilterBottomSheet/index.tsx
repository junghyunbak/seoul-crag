import { useEffect, useRef, useState } from 'react';

import { Box, Button, Chip, Typography } from '@mui/material';

import { Sheet } from 'react-modal-sheet';

import {
  useFilter,
  useModifyFilter,
  useTag,
  useExp,
  useModifyExp,
  useFilterSheet,
  useModifyFilterSheet,
  useModifySearch,
  useCrag,
} from '@/hooks';

import { zIndex } from '@/styles';

import { DateService } from '@/utils/time';

import { Molecules } from '@/components/molecules';

import { type DatePickerValue } from '@/components/molecules/DatePicker';
import { useModifyTag } from '@/hooks/useModifyTag';

const TAG_TYPE_TO_TITLE: Record<TagType, string> = {
  climb: '스타일',
  board: '트레이닝 보드',
  location: '환경',
};

const createDatePickerValue = (date: Date): DatePickerValue => {
  const hour = date.getHours();
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const isAM = hour < 12;

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate(),
    hour: hour12,
    minute: date.getMinutes(),
    meridiem: isAM ? '오전' : '오후',
  };
};

export function FilterButtonSheet() {
  const { isFilterBottomSheetOpen } = useFilterSheet();
  const { exp, isExpSelect, currentDate } = useExp();
  const { filter } = useFilter();
  const { selectTagId } = useTag();
  const { crags } = useCrag();
  const { tagTypeToTags, tagTypes } = useTag();

  const { updateFilter } = useModifyFilter();
  const { updateExpDateTimeStr } = useModifyExp();
  const { updateIsFilterBottomSheetOpen } = useModifyFilterSheet();
  const { updateIsSearchOpen } = useModifySearch();
  const { updateSelectTag, removeSelectTag } = useModifyTag();

  const defaultDatePickerValue = useRef(createDatePickerValue(exp.date)).current;

  const [pickerValue, setPickerValue] = useState<DatePickerValue>(defaultDatePickerValue);

  useEffect(() => {
    if (pickerValue === defaultDatePickerValue) {
      return;
    }

    const { year, month, date, hour, minute, meridiem } = pickerValue;

    let hour24 = hour % 12;

    if (meridiem === '오후') {
      hour24 += 12;
    }

    const createdDate = new Date(year, month - 1, date, hour24, minute);

    updateExpDateTimeStr(new DateService(createdDate).dateTimeStr);
  }, [defaultDatePickerValue, pickerValue, updateExpDateTimeStr]);

  return (
    <Sheet
      isOpen={isFilterBottomSheetOpen}
      onClose={() => {
        updateIsFilterBottomSheetOpen(false);
      }}
      detent="content-height"
      style={{
        zIndex: zIndex.filter,
        userSelect: 'none',
      }}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag={true}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2 }}>
              <Typography variant="body2">이용시간</Typography>
            </Box>

            <Molecules.DatePicker
              pickerValue={pickerValue}
              onChange={(value) => {
                setPickerValue(value);
              }}
              onRemove={() => {
                setPickerValue(createDatePickerValue(currentDate));

                setTimeout(() => {
                  updateExpDateTimeStr(null);
                }, 0);
              }}
              isRemoveActive={isExpSelect}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2, pb: 0 }}>
            <Typography variant="body2">상태</Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label="🚿 샤워실"
                  color={filter.isShower ? 'primary' : 'default'}
                  variant={filter.isShower ? 'filled' : 'outlined'}
                  onClick={() => {
                    updateFilter({ isShower: !filter.isShower });
                  }}
                />
                <Chip
                  label="🔥 할인중"
                  color={filter.isSale ? 'primary' : 'default'}
                  variant={filter.isSale ? 'filled' : 'outlined'}
                  onClick={() => {
                    updateFilter({ isSale: !filter.isSale });
                  }}
                />
                <Chip
                  label="🟢 영업중"
                  color={filter.isOpen ? 'primary' : 'default'}
                  variant={filter.isOpen ? 'filled' : 'outlined'}
                  onClick={() => {
                    updateFilter({ isOpen: !filter.isOpen });
                  }}
                />
                <FilterChip
                  isActive={filter.isTodayRemove}
                  onClick={() => {
                    updateFilter({ isTodayRemove: !filter.isTodayRemove });
                  }}
                >
                  🍂 탈거 임박
                </FilterChip>

                <FilterChip
                  isActive={filter.isNewSetting}
                  onClick={() => {
                    updateFilter({ isNewSetting: !filter.isNewSetting });
                  }}
                >
                  🔩 최근 세팅
                </FilterChip>
              </Box>
            </Box>
          </Box>

          {tagTypes.map((tagType) => {
            const tags = tagTypeToTags.get(tagType) || [];

            return (
              <Box key={tagType} sx={{ p: 2, pb: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2">{TAG_TYPE_TO_TITLE[tagType]}</Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {tags.map((tag) => {
                    const isSelect = selectTagId[tagType] === tag.id;

                    return (
                      <FilterChip
                        key={tag.id}
                        isActive={isSelect}
                        onClick={() => {
                          if (isSelect) {
                            removeSelectTag(tag);
                          } else {
                            updateSelectTag(tag);
                          }
                        }}
                      >
                        {tag.name}
                      </FilterChip>
                    );
                  })}
                </Box>
              </Box>
            );
          })}

          <Box sx={{ p: 2, width: '100%' }}>
            <Button
              variant="contained"
              sx={{ width: '100%' }}
              onClick={() => {
                updateIsFilterBottomSheetOpen(false);
                updateIsSearchOpen(true);
              }}
            >
              {`${crags.length}개의 암장 보기`}
            </Button>
          </Box>
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop />
    </Sheet>
  );
}

interface FilterChipProps {
  isActive: boolean;
  onClick: () => void;
  children: string;
}

function FilterChip({ isActive, onClick, children }: FilterChipProps) {
  return (
    <Chip
      label={children}
      color={isActive ? 'primary' : 'default'}
      variant={isActive ? 'filled' : 'outlined'}
      onClick={onClick}
    />
  );
}
