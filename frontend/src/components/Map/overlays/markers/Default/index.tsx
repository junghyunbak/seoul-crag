import { useContext, useEffect, useRef } from 'react';

import { mapContext } from '@/components/Map/index.context';
import { Box } from '@mui/material';
import { CragIcon } from '@/components/CragIcon';
import { SIZE } from '@/constants';

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
      <CragIcon width={SIZE.CRAG_MARKER_WIDTH} isSelect />
    </Box>
  );
}
