import { Box } from '@mui/material';

import { useFilter, useModifyFilter } from '@/hooks';

import { FilterChip } from './FilterChip';

import { useKeenSlider } from 'keen-slider/react';

import 'keen-slider/keen-slider.min.css';
import './index.css';

export function Filter() {
  const { filter } = useFilter();

  const { updateFilter } = useModifyFilter();

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    mode: 'free-snap',
    slides: {
      perView: 'auto',
      spacing: 8,
    },
    drag: true,
    rubberband: false,
  });

  return (
    <Box ref={sliderRef} className="keen-slider">
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
    <Box className="keen-slider__slide" sx={{ '&:first-of-type': { pl: 2 }, '&:last-of-type': { pr: 2 }, pb: '3px' }}>
      {children}
    </Box>
  );
}
