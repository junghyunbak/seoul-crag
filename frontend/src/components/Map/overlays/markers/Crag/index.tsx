import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useExp, useFilter } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { SIZE, QUERY_STRING } from '@/constants';

import { mapContext } from '@/components/Map/index.context';
import { CragIcon } from '@/components/CragIcon';
import { CragMenu } from '@/components/Map/overlays/markers/Crag/CragMenu';

import { zIndex } from '@/styles';

import { useZoom } from '@/hooks';

interface CragMarkerProps {
  crag: Crag;
  crags?: Crag[];
  onCreate?: (marker: naver.maps.Marker, idx: number, isFilter: boolean) => void;
  idx?: number;
  forCluster?: boolean;
}

export function Crag({ crag, onCreate, idx, forCluster = false }: CragMarkerProps) {
  const { map } = useContext(mapContext);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const { zoomLevel } = useZoom();
  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const { exp } = useExp();
  const { isFiltered, isOff } = useFilter(crag, exp.date);

  const markerWidth = SIZE.CRAG_MARKER_WIDTH;
  const isSelect = crag.id === selectCragId;
  const isTitleShown = (() => {
    if (isSelect) {
      return true;
    }

    return zoomLevel > 11;
  })();

  /**
   * 마커 초기화
   */
  useEffect(() => {
    if (!map || !markerRef.current) {
      return function cleanup() {};
    }

    const cragMarker = new naver.maps.Marker({
      map: forCluster ? undefined : map,
      position: new naver.maps.LatLng(crag.latitude, crag.longitude),
      icon: {
        content: markerRef.current,
      },
    });

    setMarker(cragMarker);

    onCreate?.(cragMarker, idx ?? -1, isFiltered);

    return function cleanup() {
      cragMarker.setMap(null);
    };
  }, [crag, map, onCreate, idx, forCluster, isFiltered]);

  /**
   * 선택 여부에 따라 z축 순서 변경
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    const markerZIndex = (() => {
      if (isSelect) {
        return zIndex.cragMarkerAcive;
      }

      if (isOff) {
        return zIndex.cragMarkerOff;
      }

      return zIndex.cragMarkerUnactive;
    })();

    marker.setZIndex(markerZIndex);
  }, [marker, isSelect, isOff]);

  return (
    <Box
      ref={markerRef}
      sx={{
        position: 'absolute',
        transform: `translate(-50%, -100%)`,
      }}
    >
      <Box onClick={() => setSelectCragId(crag.id)} sx={{ position: 'relative', display: 'flex' }}>
        <CragMenu crag={crag} isSelect={isSelect} />
        <Box
          sx={{
            transform: `translate(0, ${isSelect ? '0' : '50%'})`,
          }}
        >
          <CragIcon width={markerWidth} isSelect={isSelect} isClose={isOff} />
        </Box>
      </Box>

      {isTitleShown && (
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
            fontWeight={600}
            sx={{
              userSelect: 'none',
              textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
            }}
          >
            {crag.short_name || crag.name}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
