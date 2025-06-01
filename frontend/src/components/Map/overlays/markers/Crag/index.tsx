import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography, TypographyProps } from '@mui/material';

import { useExp, useFilter } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { SIZE, QUERY_STRING } from '@/constants';

import { mapContext } from '@/components/Map/index.context';
import { CragIcon } from '@/components/CragIcon';
import { CragMenu } from '@/components/Map/overlays/markers/Crag/CragMenu';
import { MarkerTitle } from '../_components/MarkerTitle';
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
        <PriceText isSale>
          할인 {price.toLocaleString()}
          {isSelect && (
            <Box
              sx={(theme) => ({
                px: 1,
                py: 0.5,
                mt: 1,
                background: theme.palette.warning.main,
                borderRadius: 1,
                position: 'relative',
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
                sx={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  transform: 'translate(-50%, -100%)',
                  display: 'flex',
                }}
              >
                <svg width="16" height="8" viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M8 0L16 8H0L8 0Z" />
                </svg>
              </Box>

              <Typography sx={(theme) => ({ color: theme.palette.common.white, textShadow: 'none' })}>
                {description}
                <br />
                {`(${format(startDate, 'a hh:mm', { locale: ko })} ~ ${format(endDate, 'a hh:mm', {
                  locale: ko,
                })})`}
              </Typography>
            </Box>
          )}
        </PriceText>
      );
    }

    return <PriceText>{crag.price === 0 ? '무료' : crag.price.toLocaleString()}</PriceText>;
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

        <MarkerTitle marker={marker} isSelect={isSelect} fontWeight="bold">
          {crag.short_name || crag.name}
          <br />

          {price}
        </MarkerTitle>

        <MarkerZIndex marker={marker} isSelect={isSelect} />
      </Box>
    </Box>
  );
}

interface PriceTextProps extends TypographyProps {
  isSale?: boolean;
}

function PriceText({ sx, isSale = false, ...props }: PriceTextProps) {
  return (
    <Typography
      component="span"
      sx={(theme) => ({
        color: isSale ? theme.palette.warning.main : theme.palette.info.main,
        fontWeight: 'inherit',
      })}
      {...props}
    />
  );
}
