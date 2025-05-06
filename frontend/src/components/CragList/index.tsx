import { Box } from '@mui/material';
import { useMap, useModifyMap } from '@/hooks';
import { CragListItem } from './CragListItem';
import { calculateDistance } from '@/utils';
import { useSearch } from '@/hooks';
import { useEffect } from 'react';
import { getGpsLatLng } from '@/utils';

interface CragListProps {
  crags: Crag[];
}

export function CragList({ crags }: CragListProps) {
  const { gpsLatLng } = useMap();
  const { searchKeyword, searchSortOption } = useSearch();

  const { updateGpsLatLng } = useModifyMap();

  useEffect(() => {
    (async () => {
      const latLng = await getGpsLatLng();

      if (!latLng) {
        alert('GPS를 가져올 수 없습니다.');
        return;
      }

      updateGpsLatLng(latLng.lat, latLng.lng);
    })();
  }, [updateGpsLatLng]);

  return (
    <Box sx={{ p: 2, overflowY: 'auto', width: '100%', height: '100%' }}>
      {getFilteredSortedCrags(crags, searchKeyword, searchSortOption, gpsLatLng?.lat, gpsLatLng?.lng).map((crag) => (
        <CragListItem key={crag.id} crag={crag} />
      ))}
    </Box>
  );
}

function getFilteredSortedCrags(
  crags: Crag[],
  keyword: string,
  sortOption: SortOption,
  userLat?: number,
  userLng?: number
): Crag[] {
  const filtered = crags.filter((crag) => crag.name.toLowerCase().includes(keyword));

  const sorted = [...filtered].sort((a, b) => {
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
