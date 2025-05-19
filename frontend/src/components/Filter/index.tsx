import React, { useEffect, useMemo, useState } from 'react';

import { Box, useTheme } from '@mui/material';

import { useExp, useFetchTags, useFilter, useModifyExp, useModifyFilter } from '@/hooks';

import { DateService } from '@/utils/time';

import { Chip } from './FilterChip';

import { ko } from 'date-fns/locale';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './index.css';
import { useTag } from '@/hooks/useTag';

const TAG_TYPE_TO_TITLE: Record<TagType, string> = {
  climb: '스타일',
  board: '트레이닝',
  location: '환경',
};

const TAG_TYPE_TO_INDEX: Record<TagType, number> = {
  climb: 0,
  board: 1,
  location: 2,
};

export function Filter() {
  const { exp, isExpSelect } = useExp();
  const { filter } = useFilter();
  const { tags } = useFetchTags();
  //const { selectTagId } = useTag();

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

  const { updateExpDateTimeStr } = useModifyExp();
  const { updateFilter } = useModifyFilter();

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    mode: 'free',
    slides: {
      perView: 'auto',
      spacing: 8,
    },
    drag: true,
    rubberband: false,
    dragSpeed: 0,
  });

  /**
   * 슬라이더 내부 요소가 유동적으로 변하도록 하는 변수들을 의존성으로 추가하여 재계산.
   *
   * 스크롤이 크게 변동할 위험이 존재.
   *
   * 크게 변동시킬 위험이 있는 상태 `selectTagId` 에 대해서는 현재 업데이트 비활성화
   */
  useEffect(() => {
    slider.current?.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tags, exp]);

  return (
    <Box className="filter">
      <Box ref={sliderRef} className="keen-slider" sx={{ zIndex: 1 }}>
        <KeenElementWrapper>
          <DatePicker
            selected={exp.date}
            onChange={(date) => date && updateExpDateTimeStr(DateService.dateToDateTimeStr(date))}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="시간(24시)"
            locale={ko}
            dateFormat="M월 d일 a h:mm"
            popperPlacement="bottom-start"
            customInput={
              <InputFilterChip
                isSelect={isExpSelect}
                emoji="🚀"
                onDelete={() => {
                  updateExpDateTimeStr(null);
                }}
              />
            }
          />
        </KeenElementWrapper>

        <KeenElementWrapper>
          <Chip label="샤워실" isSelect={filter.isShower} onClick={() => updateFilter({ isShower: !filter.isShower })}>
            <Chip.Icon>🚿</Chip.Icon>
          </Chip>
        </KeenElementWrapper>

        <KeenElementWrapper>
          <Chip
            isSelect={filter.isTodayRemove}
            label="탈거 임박"
            onClick={() => updateFilter({ isTodayRemove: !filter.isTodayRemove })}
          >
            <Chip.Icon>🍂</Chip.Icon>
          </Chip>
        </KeenElementWrapper>

        <KeenElementWrapper>
          <Chip
            isSelect={filter.isNewSetting}
            label="최근 세팅"
            onClick={() => updateFilter({ isNewSetting: !filter.isNewSetting })}
          >
            <Chip.Icon>🔩</Chip.Icon>
          </Chip>
        </KeenElementWrapper>

        {tagTypes
          .sort((a, b) => (TAG_TYPE_TO_INDEX[a] < TAG_TYPE_TO_INDEX[b] ? -1 : 1))
          .map((tagType) => {
            const tags = tagTypeToTags.get(tagType) || [];

            return <TagChip key={tagType} tags={tags} tagType={tagType} />;
          })}

        <KeenElementWrapper>
          <Chip isSelect={filter.isOpen} label="영업중" onClick={() => updateFilter({ isOpen: !filter.isOpen })}>
            <Chip.Icon>🟢</Chip.Icon>
          </Chip>
        </KeenElementWrapper>

        <KeenElementWrapper>
          <Chip
            isSelect={filter.isNonSetting}
            label="세팅 중 제외"
            onClick={() => updateFilter({ isNonSetting: !filter.isNonSetting })}
          >
            <Chip.Icon>🚧</Chip.Icon>
          </Chip>
        </KeenElementWrapper>
      </Box>
    </Box>
  );
}

function KeenElementWrapper({ children }: React.PropsWithChildren) {
  return (
    <Box className="keen-slider__slide" sx={{ '&:first-of-type': { pl: 2 }, '&:last-of-type': { pr: 2 } }}>
      {children}
    </Box>
  );
}

interface TagChipProps {
  tags: Tag[];
  tagType: Tag['type'];
}

function TagChip({ tags, tagType }: TagChipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { selectTagId, updateSelectTag, removeSelectTag } = useTag();

  const selectTag = tags.find((tag) => tag.id === selectTagId[tagType]);

  const isTypeSelect = !!selectTag;

  return (
    <KeenElementWrapper>
      <Chip
        isSelect={isTypeSelect}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        label={isTypeSelect ? selectTag.name : TAG_TYPE_TO_TITLE[tagType]}
      >
        <Chip.Icon>
          <Box
            sx={(theme) => ({
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: `6px solid ${isTypeSelect ? 'white' : theme.palette.text.secondary}`,
              transform: `rotate(${isOpen ? '-180' : '0'}deg)`,
            })}
          />
        </Chip.Icon>

        <Chip.SubMenu onClickOutOfMenu={() => setIsOpen(false)}>
          {isOpen &&
            tags.map((tag) => {
              const isSelect = selectTagId[tagType] === tag.id;

              return (
                <Chip.SubChip
                  key={tag.id}
                  isSelect={isSelect}
                  onClick={() => {
                    if (isSelect) {
                      removeSelectTag(tag);
                    } else {
                      updateSelectTag(tag);
                    }
                  }}
                  label={tag.name}
                />
              );
            })}
        </Chip.SubMenu>
      </Chip>
    </KeenElementWrapper>
  );
}

interface InputFilterChipProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSelect: boolean;
  emoji: string;
  onDelete?: () => void;
}

export const InputFilterChip = React.forwardRef<HTMLInputElement, InputFilterChipProps>(
  ({ value, onClick, isSelect, emoji, onDelete, ...rest }, ref) => {
    return (
      <>
        <Chip isSelect={isSelect} onClick={onClick as () => void} label={value as string}>
          <Chip.Icon>{emoji}</Chip.Icon>
          <Chip.DeleteButton onDelete={onDelete || (() => {})} />
        </Chip>

        <input
          ref={ref}
          value={value}
          readOnly
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            pointerEvents: 'none',
          }}
          {...rest}
        />
      </>
    );
  }
);
