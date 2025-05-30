import { useMemo } from 'react';

import { Box, Chip, Divider, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';

import { Sheet } from 'react-modal-sheet';

import {
  useFilter,
  useModifyFilter,
  useFetchTags,
  useTag,
  useExp,
  useModifyExp,
  useFilterSheet,
  useModifyFilterSheet,
} from '@/hooks';

import { zIndex } from '@/styles';

import { DateService } from '@/utils/time';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

const TAG_TYPE_TO_TITLE: Record<TagType, string> = {
  climb: '스타일',
  board: '트레이닝',
  location: '환경',
};

export function FilterButtonSheet() {
  const { isFilterBottomSheetOpen } = useFilterSheet();
  const { exp, isExpSelect } = useExp();
  const { filter } = useFilter();
  const { selectTagId, updateSelectTag, removeSelectTag } = useTag();

  const { tags } = useFetchTags();

  const { updateFilter } = useModifyFilter();
  const { updateExpDateTimeStr } = useModifyExp();
  const { updateIsFilterBottomSheetOpen } = useModifyFilterSheet();

  const tagTypeToTags = useMemo(() => {
    const _tagTypeToTags = new Map<TagType, Tag[]>();

    tags?.forEach((tag) => {
      const tags = _tagTypeToTags.get(tag.type) || [];

      tags.push(tag);

      _tagTypeToTags.set(tag.type, tags);
    });

    return _tagTypeToTags;
  }, [tags]);

  const tagTypes = useMemo(() => {
    return Array.from(tagTypeToTags.keys());
  }, [tagTypeToTags]);

  return (
    <Sheet
      isOpen={isFilterBottomSheetOpen}
      onClose={() => {
        updateIsFilterBottomSheetOpen(false);
      }}
      snapPoints={[1, 0.6, 0]}
      initialSnap={1}
      style={{
        zIndex: zIndex.filter,
      }}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2, gap: 1 }}>
            <Typography variant="h6">이용시간</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
                  <DateTimePicker
                    sx={{ width: '100%', '& input': { userSelect: 'none' } }}
                    value={dayjs(exp.date)}
                    onChange={(newValue) => {
                      if (!newValue) {
                        updateExpDateTimeStr(null);
                      } else {
                        updateExpDateTimeStr(DateService.dateToDateTimeStr(newValue.toDate()));
                      }
                    }}
                  />
                </LocalizationProvider>
              </Box>

              {isExpSelect && (
                <Box
                  sx={{
                    flexShrink: 0,
                  }}
                >
                  <IconButton
                    onClick={() => {
                      updateExpDateTimeStr(null);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
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

          <Divider />

          {tagTypes.map((tagType) => {
            const tags = tagTypeToTags.get(tagType) || [];

            return (
              <Box key={tagType} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6">{TAG_TYPE_TO_TITLE[tagType]}</Typography>

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
        </Sheet.Content>
      </Sheet.Container>
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
