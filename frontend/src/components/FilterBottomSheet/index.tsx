import { useMemo } from 'react';

import { Box, Chip, Divider, Typography } from '@mui/material';

import { Sheet } from 'react-modal-sheet';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { useFilter, useModifyFilter, useFetchTags, useTag } from '@/hooks';

const TAG_TYPE_TO_TITLE: Record<TagType, string> = {
  climb: '스타일',
  board: '트레이닝',
  location: '환경',
};

export function FilterButtonSheet() {
  const [isFilterBottomSheetOpen, setIsFilterBottonSheetOpen] = useStore(
    useShallow((s) => [s.isFilterBottomSheetOpen, s.setIsFilterBottonSheetOpen])
  );

  const { filter } = useFilter();
  const { updateFilter } = useModifyFilter();

  const { selectTagId, updateSelectTag, removeSelectTag } = useTag();

  const { tags } = useFetchTags();

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
        setIsFilterBottonSheetOpen(false);
      }}
      detent="content-height"
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Content>
          <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
            <Typography variant="h6">출발 시간</Typography>
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
