import { Box, Divider } from '@mui/material';

import { useCrag, useExp, useFilter, useMap, useSearch, useSetupGps } from '@/hooks';

import { calculateDistance } from '@/utils';
import { Molecules } from '@/components/molecules';

export function CragList() {
  const { crags } = useCrag();
  const { searchSortOption } = useSearch();
  const { exp } = useExp();
  const {
    gpsLatLng: { lat, lng },
  } = useMap();

  const { getCragStats } = useFilter();

  useSetupGps();

  /**
   * 필터 요소가 변경될 때 마다 정렬까지 발생할 경우,
   * 정렬 작업은 useCrag에서 분리하여 성능이 떨어지므로 리스트에서만 수행
   */
  const sortedCrags = crags.sort((a, b) => {
    if (searchSortOption === 'distance' && lat !== -1 && lng !== -1) {
      const distA = calculateDistance(lat, lng, a.latitude, a.longitude);
      const distB = calculateDistance(lat, lng, b.latitude, b.longitude);

      return distA - distB;
    }

    if (searchSortOption === 'newest') {
      const aDate = a.opened_at ? new Date(a.opened_at).getTime() : 0;
      const bDate = b.opened_at ? new Date(b.opened_at).getTime() : 0;

      return bDate - aDate;
    }

    if (searchSortOption === 'size') {
      return (b.area ?? 0) - (a.area ?? 0);
    }

    if (searchSortOption === 'remove') {
      const { remainSetupDay: aRemainSetupDay } = getCragStats(a, exp.date);
      const { remainSetupDay: bRemainSetupDay } = getCragStats(b, exp.date);

      return aRemainSetupDay < bRemainSetupDay ? -1 : 1;
    }

    if (searchSortOption === 'recentSetting') {
      const { elapseSetupDay: aElapseSetupDay } = getCragStats(a, exp.date);
      const { elapseSetupDay: bElapseSetupDay } = getCragStats(b, exp.date);

      return aElapseSetupDay < bElapseSetupDay ? -1 : 1;
    }

    return 0;
  });

  return (
    <Box sx={{ overflowY: 'auto' }}>
      {sortedCrags.map((crag, i) => {
        return (
          <Box key={crag.id} sx={{ py: 0.5, px: 2 }}>
            <Molecules.CragListItem crag={crag} />
            {i !== sortedCrags.length - 1 && <Divider />}
          </Box>
        );
      })}
    </Box>
  );
}
