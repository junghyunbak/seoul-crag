import { useEffect } from 'react';

import { Box, Typography, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { useLoading, useMap, useModifyLoading, useSearch } from '@/hooks';

import { useModifySearch } from '@/hooks';

import { AnimatePresence, motion } from 'framer-motion';

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
      <Box
        sx={{
          width: 20,
          height: 20,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatePresence>
          {isMarkerLoading ? (
            <motion.div
              key="A"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                inset: 0,
              }}
            >
              <CircularProgress size={'100%'} sx={{ color: 'text.secondary' }} />
            </motion.div>
          ) : (
            <motion.div
              key="B"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                inset: 0,
              }}
            >
              <SearchIcon sx={{ width: '100%', height: '100%', color: 'text.secondary' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography color="text.secondary">{searchKeyword || '클라이밍장 검색'}</Typography>
      </Box>
    </Box>
  );
}
