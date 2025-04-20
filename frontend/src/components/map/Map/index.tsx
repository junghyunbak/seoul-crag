import { useEffect } from 'react';

import { Box } from '@mui/material';

import { useMap, useSetupMap } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

export function Map() {
  const { mapRef, map } = useMap();

  const [_, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  useSetupMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    const mapClickListener = map.addListener('click', () => {
      setSelectCragId(null);
    });

    return function cleanup() {
      map.removeListener(mapClickListener);
    };
  }, [map, setSelectCragId]);

  return <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />;
}
