import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useExp, useFilter } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { SIZE, QUERY_STRING } from '@/constants';

import { mapContext } from '@/components/Map/index.context';
import { CragIcon } from '@/components/CragIcon';
import { CragMenu } from '@/components/Map/overlays/markers/Crag/CragMenu';
import { MarkerTitle } from '../_components/MarkerTitle';
import { MarkerZIndex } from '../_components/MarkerZIndex';

interface CragMarkerProps {
  crag: Crag;
  crags?: Crag[];
  onCreate?: (marker: naver.maps.Marker, idx: number, isFilter: boolean) => void;
  idx?: number;
  forCluster?: boolean;
}

export function Crag({ crag, onCreate, idx, forCluster = false }: CragMarkerProps) {
  const { map } = useContext(mapContext);
  const [marker, setMarker] = useState<MyMarker | null>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const { exp } = useExp();
  const { isFiltered, isOff, showerImages } = useFilter(crag, exp.date);

  const markerWidth = SIZE.CRAG_MARKER_WIDTH;
  const isSelect = crag.id === selectCragId;

  /**
   * 마커 초기화
   */
  useEffect(() => {
    if (!map || !markerRef.current) {
      return function cleanup() {};
    }

    const cragMarker: MyMarker = new naver.maps.Marker({
      map: forCluster ? undefined : map,
      position: new naver.maps.LatLng(crag.latitude, crag.longitude),
      icon: {
        content: markerRef.current,
      },
    });

    cragMarker.meta = {
      type: 'Crag',
      lat: crag.latitude,
      lng: crag.longitude,
    };

    setMarker(cragMarker);

    onCreate?.(cragMarker, idx ?? -1, isFiltered);

    return function cleanup() {
      cragMarker.setMap(null);
    };
  }, [crag, map, onCreate, idx, forCluster, isFiltered]);

  return (
    <Box>
      {/**
       * react-dom과 naver.maps.Marker의 충돌 방지를 위해 빈 Wrapper 필요
       */}
      <Box ref={markerRef} onClick={() => setSelectCragId(crag.id)}>
        <Box sx={{ position: 'absolute', bottom: 0, left: '-50%', display: 'flex' }}>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              transform: isSelect ? `translate(-50%, 0)` : `translate(-50%, 50%)`,
            }}
          >
            <CragMenu crag={crag} isSelect={isSelect} />
            <CragIcon
              width={markerWidth}
              isSelect={isSelect}
              isClose={isOff}
              isRect={crag.is_outer_wall}
              isUnique={showerImages.length > 0}
            />
          </Box>
        </Box>

        <MarkerTitle marker={marker} isSelect={isSelect} fontWeight="bold">
          {crag.short_name || crag.name}
          <br />
          <Typography
            component="span"
            sx={(theme) => ({
              color: theme.palette.info.main,
              fontWeight: 'inherit',
            })}
          >
            {crag.price === 0 ? '무료' : '₩' + crag.price.toLocaleString()}
          </Typography>
        </MarkerTitle>

        <MarkerZIndex marker={marker} isSelect={isSelect} />
      </Box>
    </Box>
  );
}
