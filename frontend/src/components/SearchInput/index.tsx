import { useEffect, useState } from 'react';

import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useMap, useSearch } from '@/hooks';

import { useModifySearch } from '@/hooks';

export function SearchInput() {
  const { updateIsSearchOpen } = useModifySearch();

  const { searchKeyword } = useSearch();

  const { map } = useMap();

  const [isMarkerLoading, setIsMarkerLoading] = useState(false);

  useEffect(() => {
    if (!map) {
      return;
    }

    const dragStartListener = map.addListener('dragstart', () => {
      setIsMarkerLoading(true);
    });

    const dragEndListener = map.addListener('dragend', () => {
      setIsMarkerLoading(false);
    });

    const zoomStartListener = map.addListener('zoomstart', () => {
      setIsMarkerLoading(true);
    });

    const zoomEndListener = map.addListener('zoomend', () => {
      setIsMarkerLoading(false);
    });

    return function cleanup() {
      map.removeListener(dragStartListener);
      map.removeListener(dragEndListener);
      map.removeListener(zoomStartListener);
      map.removeListener(zoomEndListener);
    };
  }, [map]);

  return (
    <Paper
      sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
      onClick={() => updateIsSearchOpen(true)}
    >
      <Box sx={{ width: 20, height: 20 }}>
        {isMarkerLoading ? (
          <CircularProgress size={'100%'} sx={{ color: 'text.secondary' }} />
        ) : (
          <SearchIcon sx={{ width: '100%', height: '100%', color: 'text.secondary' }} />
        )}
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography color="text.secondary">{searchKeyword || '클라이밍장 검색'}</Typography>
      </Box>
    </Paper>
  );
}
