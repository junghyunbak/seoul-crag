import { useContext, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import { SIZE } from '@/constants';

import { mapContext } from '@/components/Map/index.context';

import { CafeInfo } from './CafeInfo';
import { MarkerTitle } from '../_components/MarkerTitle';
import { MarkerZIndex } from '../_components/MarkerZIndex';
import { MarkerIcon } from '../_assets/MarkerIcon';

import { useCafe, useModifyCafe } from '@/hooks';

interface CafeProps {
  cafe: Cafe;
  idx: number;
  onCreate?: (marker: naver.maps.Marker, idx: number) => void;
  forCluster?: boolean;
}

export function Cafe({ cafe, idx, onCreate, forCluster = false }: CafeProps) {
  const [marker, setMarker] = useState<MyMarker | null>(null);

  const markerRef = useRef<HTMLDivElement>(null);
  const markerIconRef = useRef<HTMLDivElement>(null);

  const { map } = useContext(mapContext);
  const { selectCafeId } = useCafe();

  const { updateSelectCafeId } = useModifyCafe();

  const markerWidth = SIZE.CAFE_MARKER_WIDTH;
  const isSelect = selectCafeId === cafe.id;

  useEffect(() => {
    if (!map || !markerRef.current) {
      return;
    }

    const marker: MyMarker = new naver.maps.Marker({
      map: forCluster ? undefined : map,
      position: new naver.maps.LatLng(+cafe.y, +cafe.x),
      icon: {
        content: markerRef.current,
      },
    });

    marker.meta = {
      type: 'Cafe',
      lat: +cafe.y,
      lng: +cafe.x,
    };

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
      <Box ref={markerRef}>
        <Box
          onClick={() => {
            updateSelectCafeId(cafe.id);
          }}
          sx={{ position: 'absolute', bottom: 0, left: '-50%', display: 'flex' }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              transform: isSelect ? `translate(-50%, 0)` : `translate(-50%, 50%)`,
            }}
            ref={markerIconRef}
          >
            {isSelect ? (
              <MarkerIcon.Active bgColor="#b13f0e" bottomMountainColor="#E26E3B" width={markerWidth} />
            ) : (
              <MarkerIcon.Inactive.Circle backgroundColor="#b13f0e" width={markerWidth} />
            )}

            {isSelect && <CafeInfo cafe={cafe} referenceRef={markerIconRef} />}
          </Box>
        </Box>

        <MarkerTitle marker={marker} isSelect={isSelect}>
          {cafe.place_name.split(' ')[0]}
        </MarkerTitle>

        <MarkerZIndex marker={marker} isSelect={isSelect} />
      </Box>
    </Box>
  );
}
