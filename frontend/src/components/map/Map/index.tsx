import { useEffect } from 'react';

import { Box } from '@mui/material';

import { useMap, useModifyCrag, useSetupMap } from '@/hooks';

export function Map() {
  const { mapRef, map } = useMap();

  const { updateSelectCragId } = useModifyCrag();

  useSetupMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    const mapClickListener = map.addListener('click', () => {
      updateSelectCragId(null);
    });

    return function cleanup() {
      map.removeListener(mapClickListener);
    };
  }, [map, updateSelectCragId]);

  return <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />;
}
