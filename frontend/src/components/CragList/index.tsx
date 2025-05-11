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
          {getSortedCrags(filteredCrags, searchSortOption, gpsLatLng?.lat, gpsLatLng?.lng).map((crag, i, arr) => (
            <>
              <CragListItem key={crag.id} crag={crag} />
              {i !== arr.length - 1 && <Divider />}
            </>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

function getSortedCrags(crags: Crag[], sortOption: SortOption, userLat?: number, userLng?: number): Crag[] {
  const sorted = [...crags].sort((a, b) => {
    if (sortOption === 'distance' && userLat !== undefined && userLng !== undefined) {
      const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
      const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
      return distA - distB;
    }
    if (sortOption === 'newest') {
      const aDate = a.opened_at ? new Date(a.opened_at).getTime() : 0;
      const bDate = b.opened_at ? new Date(b.opened_at).getTime() : 0;
      return bDate - aDate;
    }
    if (sortOption === 'size') {
      return (b.area ?? 0) - (a.area ?? 0);
    }
    return 0;
  });

  return sorted;
}
