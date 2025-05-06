import React from 'react';

import { Box } from '@mui/material';

import { useFilter, useModifyFilter } from '@/hooks';

import DatePicker from 'react-datepicker';

import { FilterChip } from './FilterChip';

import { useKeenSlider } from 'keen-slider/react';

import { ko } from 'date-fns/locale';

import { time } from '@/utils';

import { InputFilterChip } from './FilterChip';

import 'react-datepicker/dist/react-datepicker.css';
import 'keen-slider/keen-slider.min.css';
import './index.css';

export function Filter() {
  const { filter, expeditionDate } = useFilter();

  const { updateFilter } = useModifyFilter();

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: 'free',
    slides: {
      perView: 'auto',
      spacing: 8,
    },
    drag: true,
    rubberband: false,
    dragSpeed: 0,
  });

  return (
    <Box ref={sliderRef} className="keen-slider">
      <KeenElementWrapper>
        <DatePicker
          selected={expeditionDate}
          onChange={(date) => date && updateFilter({ date: time.dateToDateTimeStr(date) })}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="시간(24시)"
          locale={ko}
          dateFormat="M월 d일 a h:mm"
          popperPlacement="bottom-start"
          customInput={
            <InputFilterChip
              isSelect={filter.date !== null}
              emoji="🚀"
              onDelete={() => {
                updateFilter({ date: null });
              }}
            />
          }
        />
      </KeenElementWrapper>
      <KeenElementWrapper>
        <FilterChip
          isSelect={filter.isShower}
          label="샤워실"
          emoji="🚿"
          onClick={() => updateFilter({ isShower: !filter.isShower })}
        />
      </KeenElementWrapper>
      <KeenElementWrapper>
        <FilterChip
          isSelect={filter.isNewSetting}
          label="New 세팅"
          emoji="✨"
          onClick={() => updateFilter({ isNewSetting: !filter.isNewSetting })}
        />
      </KeenElementWrapper>
      <KeenElementWrapper>
        <FilterChip
          isSelect={filter.isNonSetting}
          label="세팅 제외"
          emoji="🚧"
          onClick={() => updateFilter({ isNonSetting: !filter.isNonSetting })}
        />
      </KeenElementWrapper>
      <KeenElementWrapper>
        <FilterChip
          isSelect={filter.isTodayRemove}
          label="오늘 탈거"
          emoji="🍂"
          onClick={() => updateFilter({ isTodayRemove: !filter.isTodayRemove })}
        />
      </KeenElementWrapper>
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
