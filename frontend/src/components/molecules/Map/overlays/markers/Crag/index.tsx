import { useContext, useEffect, useRef, useState } from 'react';

import { Box, Typography, useTheme } from '@mui/material';

import { useExp, useFilter, useCrewCount } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { SIZE, QUERY_STRING } from '@/constants';

import { mapContext } from '@/components/molecules/Map/index.context';

import { CragMenu } from './CragMenu';
import { MarkerTitle } from '../_components/MarkerTitle';
import { MarkerZIndex } from '../_components/MarkerZIndex';
import { Atoms } from '@/components/atoms';
import { Molecules } from '@/components/molecules';

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

  const { crewCount } = useCrewCount();
  const { exp } = useExp();
  const { isFiltered, isOff, showerImages, appliedDailyDiscount, appliedGroupDiscount } = useFilter(crag, {
    date: exp.date,
    crewCount,
  });

  const theme = useTheme();

  const isSelect = crag.id === selectCragId;

  const activeMarkerWidth = SIZE.CRAG_MARKER_WIDTH;
  const unactiveMarkerWidth = SIZE.CRAG_MARKER_WIDTH * 0.6;

  const markerWidth = (() => {
    if (isSelect) {
      return activeMarkerWidth;
    }

    return unactiveMarkerWidth;
  })();

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
          <Atoms.Text.Halo
            sx={(theme) => ({
              color: theme.palette.warning.main,
            })}
          >
            {price.toLocaleString()}
          </Atoms.Text.Halo>

          {isSelect && (
            <Balloon bgColor={theme.palette.warning.main}>
              <Typography
                sx={(theme) => ({ color: theme.palette.common.white, textShadow: 'none', textAlign: 'center' })}
              >
                {description}
                <br />
                {`(${format(startDate, 'a hh:mm', { locale: ko })} ~ ${format(endDate, 'a hh:mm', {
                  locale: ko,
                })})`}
              </Typography>
            </Balloon>
          )}
        </Box>
      );
    }

    if (appliedGroupDiscount) {
      const { price, min_group_size } = appliedGroupDiscount;

      return (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Atoms.Text.Halo
            sx={(theme) => ({
              color: theme.palette.info.dark,
            })}
          >
            {price.toLocaleString()}
          </Atoms.Text.Halo>

          <Balloon bgColor={theme.palette.info.dark}>
            <Typography
              sx={{
                textAlign: 'center',
                color: theme.palette.common.white,
              }}
            >{`${min_group_size}인 이상 단체 할인`}</Typography>
          </Balloon>
        </Box>
      );
    }

    return (
      <Atoms.Text.Halo sx={(theme) => ({ color: theme.palette.info.main })}>
        {crag.price === 0 ? '무료' : crag.price.toLocaleString()}
      </Atoms.Text.Halo>
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
            <Molecules.CragIcon
              width={markerWidth}
              isSelect={isSelect}
              isClose={isOff}
              isRect={crag.is_outer_wall}
              isUnique={showerImages.length > 0}
            />
          </Box>
        </Box>

        <Box>
          <MarkerTitle
            marker={marker}
            isSelect={isSelect}
            label={crag.short_name || crag.name}
            markerWidth={unactiveMarkerWidth}
          >
            {price && <MarkerTitle.SaleInfo>{price}</MarkerTitle.SaleInfo>}
          </MarkerTitle>
        </Box>

        <MarkerZIndex marker={marker} isSelect={isSelect} />
      </Box>
    </Box>
  );
}

function Balloon({ children, bgColor }: React.PropsWithChildren & { bgColor: string }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        px: 1,
        py: 0.5,
        mt: 1,
        background: bgColor,
        borderRadius: 1,

        border: '1px solid white',
      }}
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
          color: bgColor,
        }}
      >
        <svg width="16" height="8" viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="M8 0L16 8H0L8 0Z" />
        </svg>
      </Box>

      {children}
    </Box>
  );
}
