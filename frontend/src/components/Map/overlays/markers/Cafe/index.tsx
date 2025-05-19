import { mapContext } from '@/components/Map/index.context';
import { SIZE } from '@/constants';
import { Box, Typography } from '@mui/material';
import { useContext, useEffect, useRef } from 'react';
import { MarkerIcon } from '../_assets/MarkerIcon';

interface CafeProps {
  cafe: Cafe;
  idx: number;
  onCreate?: (marker: naver.maps.Marker, idx: number) => void;
  forCluster?: boolean;
}

export function Cafe({ cafe, idx, onCreate, forCluster = false }: CafeProps) {
  const { map } = useContext(mapContext);

  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || !markerRef.current) {
      return;
    }

    const marker = new naver.maps.Marker({
      map: forCluster ? undefined : map,
      position: new naver.maps.LatLng(+cafe.y, +cafe.x),
      icon: {
        content: markerRef.current,
      },
    });

    onCreate?.(marker, idx);

    return function cleanup() {
      marker.setMap(null);
    };
  }, [map, cafe, onCreate, idx, forCluster]);

  const markerWidth = SIZE.CAFE_MARKER_WIDTH;
  const isSelect = false;

  return (
    <Box
      ref={markerRef}
      sx={{
        position: 'absolute',
        transform: `translate(-50%, -100%)`,
      }}
    >
      <Box onClick={() => {}}>
        <Box
          sx={{
            transform: `translate(0, ${isSelect ? '0' : '50%'})`,
          }}
        >
          <MarkerIcon.Inactive.Circle backgroundColor="#b13f0e" width={markerWidth} />
        </Box>
      </Box>

      <Box
        sx={{
          /**
           * position: absolute가 아니면 전체 크기가 커져서 translate가 망가짐.
           */
          position: 'absolute',
          transform: `translate(calc(-50% + ${(markerWidth * (isSelect ? 1 : 0.6)) / 2}px), ${isSelect ? 0 : '50%'})`,
        }}
      >
        <Typography
          sx={{
            textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
          }}
        >
          {cafe.place_name}
        </Typography>
      </Box>
    </Box>
  );
}
