import dayjs, { Dayjs } from 'dayjs';

import { crags } from '@/mocks/crag';
import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';

export function useCrag(/*date: Dayjs | null, exerciseTimeRange: [number, number]*/) {
  const [cragMap] = useStore(useShallow((s) => [s.cragMap]));
  const [selectCragId] = useStore(useShallow((s) => [s.selectCragId]));

  const filteredCrags = crags.filter((crag) => {
    /*
    const isOffDayExist = crag.offDays.some((offday) => dayjs(offday).isSame(date, 'day'));

    const isOpen =
      !date || exerciseTimeRange[1] - exerciseTimeRange[0] === 24
        ? true
        : crag.openingHours[date.day()][0] <= exerciseTimeRange[0] &&
          exerciseTimeRange[1] <= crag.openingHours[date.day()][1];

    return !isOffDayExist && isOpen;
    */

    return crag;
  });

  const openCragCount = filteredCrags.length;

  const cragArea = useMemo(() => {
    let maxCragArea = 0;
    let minCragArea = 1000;

    Object.values(cragMap).forEach((crag) => {
      if (!crag.area) {
        return;
      }

      maxCragArea = Math.max(maxCragArea, crag.area);
      minCragArea = Math.min(minCragArea, crag.area);
    });

    return {
      minCragArea,
      maxCragArea,
    };
  }, [cragMap]);

  return { filteredCrags, openCragCount, cragMap, selectCragId, cragArea };
}
