import { useEffect } from 'react';

import { Box } from '@mui/material';

import { useLoading, useMap, useModifyLoading, useSearch } from '@/hooks';

import { useModifySearch } from '@/hooks';
import { Molecules } from '@/components/molecules';
import { Atoms } from '@/components/atoms';

export function SearchInput() {
  const { updateIsSearchOpen } = useModifySearch();

  const { searchKeyword } = useSearch();

  const { map } = useMap();

  const { isMarkerLoading } = useLoading();

  const { updateIsMarkerLoading } = useModifyLoading();

  useEffect(() => {
    if (!map) {
      return;
    }

    const dragStartListener = map.addListener('dragstart', () => {
      updateIsMarkerLoading(true);
    });

    const zoomStartListener = map.addListener('zoomstart', () => {
      updateIsMarkerLoading(true);
    });

    const idleListener = map.addListener('idle', () => {
      updateIsMarkerLoading(false);
    });

    return function cleanup() {
      map.removeListener(dragStartListener);
      map.removeListener(zoomStartListener);
      map.removeListener(idleListener);
    };
  }, [map, updateIsMarkerLoading]);

  return (
    <Box
      sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
      onClick={() => updateIsSearchOpen(true)}
    >
      <Molecules.SearchAndLoading isLoading={isMarkerLoading} />

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Atoms.Text.Body>{searchKeyword || '클라이밍장 검색'}</Atoms.Text.Body>
      </Box>
    </Box>
  );
}
