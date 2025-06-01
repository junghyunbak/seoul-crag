import { useEffect, useMemo, useState } from 'react';

import { Box, Button, Chip, IconButton, SxProps, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { Sheet } from 'react-modal-sheet';

import Picker from 'react-mobile-picker';

import {
  useFilter,
  useModifyFilter,
  useFetchTags,
  useTag,
  useExp,
  useModifyExp,
  useFilterSheet,
  useModifyFilterSheet,
  useMap,
} from '@/hooks';

import { zIndex } from '@/styles';
import { endOfMonth } from 'date-fns';
import { DateService } from '@/utils/time';
import { DAY_LABELS } from '@/constants';

type UseTimePickerValue = {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  meridiem: '오전' | '오후';
};

const TAG_TYPE_TO_TITLE: Record<TagType, string> = {
  climb: '스타일',
  board: '트레이닝 보드',
  location: '환경',
};

interface FilterButtonSheetProps {
  crags?: Crag[];
}

export function FilterButtonSheet({ crags = [] }: FilterButtonSheetProps) {
  const { isFilterBottomSheetOpen } = useFilterSheet();
  const { exp, isExpSelect } = useExp();
  const { filter, getCragStats } = useFilter();
  const { selectTagId, updateSelectTag, removeSelectTag } = useTag();
  const { map } = useMap();

  const { tags } = useFetchTags();

  const { updateFilter } = useModifyFilter();
  const { updateExpDateTimeStr } = useModifyExp();
  const { updateIsFilterBottomSheetOpen } = useModifyFilterSheet();

  const filteredCrags = crags.filter((crag) => getCragStats(crag, exp.date).isFiltered);
  const filteredCount = filteredCrags.length;

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

  const createUseTimePickerDefaultValue = (date: Date): UseTimePickerValue => {
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

  const [pickerValue, setPickerValue] = useState<UseTimePickerValue>(createUseTimePickerDefaultValue(exp.date));

  const { year, month } = pickerValue;

  const date = new Date(year, month - 1);

  const endDate = endOfMonth(date);

  const selections: { [P in keyof UseTimePickerValue]: UseTimePickerValue[P][] } = {
    year: [],
    month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    date: Array(endDate.getDate())
      .fill(null)
      .map((_, i) => i + 1),
    hour: Array(12)
      .fill(null)
      .map((_, i) => i + 1),
    minute: Array(60)
      .fill(null)
      .map((_, i) => i),
    meridiem: ['오전', '오후'],
  };

  const pickerKeys: (keyof UseTimePickerValue)[] = ['month', 'date', 'hour', 'minute', 'meridiem'];
  const pickerKeyToSuffix: Record<keyof UseTimePickerValue, string> = {
    year: '년',
    month: '월',
    date: '일',
    hour: '시',
    minute: '분',
    meridiem: '',
  };
  const pickerKeyToSx: Record<keyof UseTimePickerValue, SxProps> = {
    year: {},
    month: {
      justifyContent: 'flex-end',
    },
    date: {
      justifyContent: 'flex-start',
    },
    hour: {
      justifyContent: 'flex-end',
    },
    minute: {
      justifyContent: 'flex-start',
    },
    meridiem: {},
  };

  useEffect(() => {
    const { year, month, date, hour, minute, meridiem } = pickerValue;

    let hour24 = hour % 12;

    if (meridiem === '오후') {
      hour24 += 12;
    }

    const createdDate = new Date(year, month - 1, date, hour24, minute);

    updateExpDateTimeStr(new DateService(createdDate).dateTimeStr);
  }, [pickerValue, updateExpDateTimeStr]);

  return (
    <Sheet
      isOpen={isFilterBottomSheetOpen}
      onClose={() => {
        updateIsFilterBottomSheetOpen(false);
      }}
      detent="content-height"
      style={{
        zIndex: zIndex.filter,
      }}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content disableDrag={true}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2 }}>
              <Typography variant="body2">이용시간</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Picker
                  value={pickerValue}
                  onChange={(value) => {
                    setPickerValue(value);
                  }}
                  height={100}
                  wheelMode="natural"
                >
                  {pickerKeys.map((pickerKey) => (
                    <Picker.Column key={pickerKey} name={pickerKey}>
                      {selections[pickerKey].map((option) => {
                        const day = (() => {
                          if (pickerKey !== 'date' || typeof option !== 'number') {
                            return '';
                          }

                          const { year, month } = pickerValue;

                          return `(${DAY_LABELS[new Date(year, month - 1, option).getDay()]})`;
                        })();

                        return (
                          <Picker.Item key={option} value={option}>
                            {({ selected }) => {
                              return (
                                <Box sx={{ ...{ width: '100%', display: 'flex', px: 1 }, ...pickerKeyToSx[pickerKey] }}>
                                  <Typography
                                    sx={(theme) => ({
                                      color: selected ? theme.palette.common.black : theme.palette.text.secondary,
                                    })}
                                  >
                                    {`${option}${pickerKeyToSuffix[pickerKey]} ${day}`}
                                  </Typography>
                                </Box>
                              );
                            }}
                          </Picker.Item>
                        );
                      })}
                    </Picker.Column>
                  ))}
                </Picker>
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

                if (filteredCrags.length > 0 && map) {
                  const [filteredCrag] = filteredCrags;

                  map.morph(new naver.maps.LatLng(filteredCrag.latitude, filteredCrag.longitude));
                }
              }}
            >
              {`${filteredCount}개의 암장 보기`}
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
