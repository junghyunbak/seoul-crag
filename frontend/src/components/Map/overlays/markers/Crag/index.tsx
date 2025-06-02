import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { useExp, useFilter } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { SIZE, QUERY_STRING } from '@/constants';

import { mapContext } from '@/components/Map/index.context';
import { CragIcon } from '@/components/CragIcon';
import { CragMenu } from '@/components/Map/overlays/markers/Crag/CragMenu';
import { MarkerTitle, HaloText } from '../_components/MarkerTitle';
import { MarkerZIndex } from '../_components/MarkerZIndex';
import { DateService } from '@/utils/time';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
  const { isFiltered, isOff, showerImages, appliedDailyDiscount } = useFilter(crag, exp.date);

  const markerWidth = SIZE.CRAG_MARKER_WIDTH;
  const isSelect = crag.id === selectCragId;

  // 할인 적용 우선순위 없는 상태.
  // [ ]: 단체가 활성화되었을 땐, 단체 할인 가격 먼저 보여주기
  const price = (() => {
    if (appliedDailyDiscount) {
      const { price, time_start, time_end, description } = appliedDailyDiscount;

      const startDate = DateService.timeStrToDate(time_start, exp.date);
      const endDate = DateService.timeStrToDate(time_end, exp.date);

      return (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <HaloText
            sx={(theme) => ({
              color: theme.palette.warning.main,
            })}
          >
            {price.toLocaleString()}
          </HaloText>

          {isSelect && (
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: '100%',
                px: 1,
                py: 0.5,
                mt: 1,
                background: theme.palette.warning.main,
                borderRadius: 1,

                border: '1px solid white',
              })}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translate(-50%, -100%)',
                  display: 'flex',
                  color: 'white',
                }}
              >
                <svg width="18" height="10" viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M8 0L16 8H0L8 0Z" />
                </svg>
              </Box>

              <Box
                sx={(theme) => ({
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translate(-50%, -100%)',
                  display: 'flex',
                  color: theme.palette.warning.main,
                })}
              >
                <svg width="16" height="8" viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M8 0L16 8H0L8 0Z" />
                </svg>
              </Box>

              <Typography
                sx={(theme) => ({ color: theme.palette.common.white, textShadow: 'none', textAlign: 'center' })}
              >
                {description}
                <br />
                {`(${format(startDate, 'a hh:mm', { locale: ko })} ~ ${format(endDate, 'a hh:mm', {
                  locale: ko,
                })})`}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return (
      <HaloText sx={(theme) => ({ color: theme.palette.info.main })}>
        {crag.price === 0 ? '무료' : crag.price.toLocaleString()}
      </HaloText>
    );
  })();

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

        <Box>
          <MarkerTitle marker={marker} isSelect={isSelect} label={crag.short_name || crag.name}>
            {price && <MarkerTitle.SaleInfo>{price}</MarkerTitle.SaleInfo>}
          </MarkerTitle>
        </Box>

        <MarkerZIndex marker={marker} isSelect={isSelect} />
      </Box>
    </Box>
  );
}
