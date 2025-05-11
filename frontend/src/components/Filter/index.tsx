import React from 'react';

import { Box } from '@mui/material';

import { useExp, useFilter, useModifyExp, useModifyFilter } from '@/hooks';

import { DateService } from '@/utils/time';

import { FilterChip, InputFilterChip } from './FilterChip';

import { ko } from 'date-fns/locale';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import './index.css';

export function Filter() {
  const { exp, isExpSelect } = useExp();
  const { filter } = useFilter();

  const { updateExpDateTimeStr } = useModifyExp();
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
          <FilterChip
            isSelect={filter.isShower}
            label="샤워실"
            emoji="🚿"
            onClick={() => updateFilter({ isShower: !filter.isShower })}
          />
        </KeenElementWrapper>
        <KeenElementWrapper>
          <FilterChip
            isSelect={filter.isOuterWall}
            label="외벽"
            emoji="🧗🏻"
            onClick={() => updateFilter({ isOuterWall: !filter.isOuterWall })}
          />
        </KeenElementWrapper>
        <KeenElementWrapper>
          <FilterChip
            isSelect={filter.isTodayRemove}
            label="탈거 임박"
            emoji="🍂"
            onClick={() => updateFilter({ isTodayRemove: !filter.isTodayRemove })}
          />
        </KeenElementWrapper>
        <KeenElementWrapper>
          <FilterChip
            isSelect={filter.isNewSetting}
            label="최근 세팅"
            emoji="🔩"
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
