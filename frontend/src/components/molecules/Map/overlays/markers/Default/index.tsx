import { useContext, useEffect, useRef } from 'react';

import { Box } from '@mui/material';

import { mapContext } from '@/components/molecules/Map/index.context';

import { SIZE } from '@/constants';

import { Molecules } from '@/components/molecules';

interface DefaultProps {
  onCreate?: (marker: naver.maps.Marker) => void;
}

export function Default({ onCreate }: DefaultProps) {
  const { map } = useContext(mapContext);

  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !markerRef.current) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: map.getCenter(),
      icon: {
        content: markerRef.current,
      },
    });

    onCreate?.(marker);

    return function () {
      marker.setMap(null);
    };
  }, [map, onCreate]);

  return (
    <Box
      ref={markerRef}
      sx={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        display: 'flex',
      }}
    >
      <Molecules.CragIcon width={SIZE.CRAG_MARKER_WIDTH} isSelect />
    </Box>
  );
}
