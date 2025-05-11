import { useEffect } from 'react';

import { Box, Divider, Typography, useTheme } from '@mui/material';

import { useExp, useFilter, useMap, useModifyMap } from '@/hooks';

import { calculateDistance, getGpsLatLng } from '@/utils';

import { useSearch } from '@/hooks';

import { CragListItem } from './CragListItem';

interface CragListProps {
  crags: Crag[];
}

export function CragList({ crags }: CragListProps) {
  const { exp } = useExp();
  const { gpsLatLng } = useMap();
  const { searchSortOption, searchKeyword } = useSearch();
  const { getCragStats } = useFilter();
  const theme = useTheme();

  const { updateGpsLatLng } = useModifyMap();

  useEffect(() => {
    (async () => {
      const latLng = await getGpsLatLng();

      if (!latLng) {
        return;
      }

      updateGpsLatLng(latLng.lat, latLng.lng);
    })();
  }, [updateGpsLatLng]);

  const filteredCrags = crags.filter((crag) => {
    const { isFiltered } = getCragStats(crag, exp.date);

    const isKeywordInclude = crag.name.includes(searchKeyword) || crag.short_name?.includes(searchKeyword);

    return isFiltered && isKeywordInclude;
  });

  const { lat, lng } = gpsLatLng;

  const sortedCrags = filteredCrags.sort((a, b) => {
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

      return (aElapseSetupDay === -1 ? Infinity : aElapseSetupDay) <
        (bElapseSetupDay === -1 ? Infinity : bElapseSetupDay)
        ? -1
        : 1;
    }

    return 0;
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: 2,
          pt: 0,
        }}
      >
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {`${filteredCrags.length}개의 검색 결과`}
        </Typography>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ py: 0.5, px: 2, width: '100%', height: '100%', overflowY: 'auto' }}>
          {sortedCrags.map((crag, i, arr) => (
            <Box key={crag.id}>
              <CragListItem crag={crag} />
              {i !== arr.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
