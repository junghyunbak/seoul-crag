import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { SIZE } from '@/constants';

import { mapContext } from '@/components/Map/index.context';

import { CafeInfo } from './CafeInfo';
import { MarkerIcon } from '../_assets/MarkerIcon';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { useCafe, useModifyCafe, useZoom } from '@/hooks';
import { useMarkerState } from '../_hooks/useMarkerState';

interface CafeProps {
  cafe: Cafe;
  idx: number;
  onCreate?: (marker: naver.maps.Marker, idx: number) => void;
  forCluster?: boolean;
}

export function Cafe({ cafe, idx, onCreate, forCluster = false }: CafeProps) {
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  const markerRef = useRef<HTMLDivElement>(null);

  const { map } = useContext(mapContext);
  const { zoomLevel } = useZoom();
  const { selectCafeId } = useCafe();
  const [recognizer] = useStore(useShallow((s) => [s.recognizer]));

  const { updateSelectCafeId } = useModifyCafe();

  const markerWidth = SIZE.CAFE_MARKER_WIDTH;
  const isSelect = selectCafeId === cafe.id;
  const { isTitleShown, zIndex } = useMarkerState({ marker, recognizer, zoomLevel, isSelect });

  useEffect(() => {
    if (!marker) {
      return;
    }

    marker.setZIndex(zIndex);
  }, [marker, zIndex]);

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

    setMarker(marker);

    onCreate?.(marker, idx);

    return function cleanup() {
      marker.setMap(null);
    };
  }, [map, cafe, onCreate, idx, forCluster]);

  return (
    <Box>
      {/**
       * !!! 동적으로 요소를 관리 할 경우, markerRef 참조 요소 위에 또 다른 jsx dom을 하나 감싸야 함 !!!
       *
       * 루트 요소가 곧 markerRef가 되면, map과 react-dom이 같은 요소를 제거하려 하면서 오류가 발생하기 때문.
       */}
      <Box
        ref={markerRef}
        sx={{
          position: 'absolute',
          transform: `translate(-50%, -100%)`,
        }}
      >
        <Box
          onClick={() => {
            updateSelectCafeId(cafe.id);
          }}
        >
          <Box
            sx={{
              transform: `translate(0, 50%)`,
            }}
          >
            <MarkerIcon.Inactive.Circle backgroundColor="#b13f0e" width={markerWidth} />
          </Box>
        </Box>

        {isSelect && <CafeInfo cafe={cafe} referenceRef={markerRef} />}

        {isTitleShown && (
          <Box
            sx={{
              /**
               * position: absolute가 아니면 전체 크기가 커져서 translate가 망가짐.
               */
              position: 'absolute',
              transform: `translate(calc(-50% + ${(markerWidth * 0.6) / 2}px), 50%)`,
            }}
          >
            <Typography
              sx={{
                textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
              }}
            >
              {cafe.place_name.split(' ')[0]}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
