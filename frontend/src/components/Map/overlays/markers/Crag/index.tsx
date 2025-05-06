import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Box, Typography, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import ShowerIcon from '@mui/icons-material/Shower';
import InfoIcon from '@mui/icons-material/Info';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import { useFilter } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { motion, AnimatePresence } from 'framer-motion';

import { SIZE, QUERY_STRING } from '@/constants';

import { mapContext } from '@/components/Map/index.context';
import { CragIcon } from '@/components/CragIcon';

import { zIndex } from '@/styles';

import { useZoom } from '@/hooks';

const BASE_ANGLE = -135;
const RADIUS = 70;

type Feature = {
  icon: React.ReactNode;
  callback: () => void;
  disabled: boolean;
};

interface CragMarkerProps {
  crag: Crag;
  crags?: Crag[];
  onCreate?: (marker: naver.maps.Marker, idx: number) => void;
  idx?: number;
  forCluster?: boolean;
}

export function Crag({ crag, onCreate, idx, forCluster = false }: CragMarkerProps) {
  const { map } = useContext(mapContext);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const { zoomLevel } = useZoom();
  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);
  const [, setSelectCragDetailId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);
  const [, setShowerStory] = useQueryParam(QUERY_STRING.STORY_SHOWER, StringParam);
  const [, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);
  const { isCragFilter, isCragOff } = useFilter(crag);

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

    onCreate?.(cragMarker, idx ?? -1);

    return function cleanup() {
      cragMarker.setMap(null);
    };
  }, [crag, map, onCreate, idx, forCluster]);

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

      if (isCragOff) {
        return zIndex.cragMarkerOff;
      }

      return zIndex.cragMarkerUnactive;
    })();

    marker.setZIndex(markerZIndex);
  }, [marker, isSelect, isCragOff]);

  /**
   * 방사형 메뉴 계산
   */
  const features = useMemo<Feature[]>(() => {
    const _features: Feature[] = [];

    _features.push({
      icon: <CalendarMonthIcon />,
      callback: () => {
        setScheduleStory(crag.id);
      },
      disabled: false,
    });

    _features.push({
      icon: <InfoIcon color="primary" />,
      callback: () => {
        setSelectCragDetailId(crag.id);
      },
      disabled: false,
    });

    if (crag.imageTypes?.includes('shower')) {
      _features.push({
        icon: <ShowerIcon />,
        callback: () => {
          setShowerStory(crag.id);
        },
        disabled: false,
      });
    }

    return _features;
  }, [crag, setScheduleStory, setSelectCragDetailId, setShowerStory]);

  const handleMarkerClick = () => {
    setSelectCragId(crag.id);
  };

  return (
    <Box
      ref={markerRef}
      sx={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        opacity: !isCragFilter ? 0.3 : 1,
        pointerEvents: !isCragFilter ? 'none' : 'auto',
      }}
    >
      {/**
       * 마커
       */}
      <Box onClick={handleMarkerClick} sx={{ position: 'relative', display: 'flex' }}>
        {/**
         * 아이콘
         */}
        <CragIcon width={markerWidth} isSelect={isSelect} isClose={isCragOff} />

        {/**
         * 방사형 메뉴
         */}
        <AnimatePresence>
          {crag.id === selectCragId &&
            features.map((feature, index) => {
              const angleRad = ((BASE_ANGLE + index * 45) * Math.PI) / 180;

              const x = RADIUS * Math.cos(angleRad);
              const y = RADIUS * Math.sin(angleRad);

              return (
                <motion.div
                  key={index}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ x, y, opacity: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                  }}
                >
                  <IconButton
                    sx={{
                      bgcolor: 'white',
                      boxShadow: 2,
                      width: 40,
                      height: 40,
                      '&:hover': { bgcolor: grey[100] },
                    }}
                    onClick={feature.callback}
                    disabled={feature.disabled}
                  >
                    {feature.icon}
                  </IconButton>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </Box>

      {/**
       * 제목
       */}
      {isTitleShown && (
        <Box
          sx={{
            /**
             * position: absolute가 아니면 전체 크기가 커져서 translate가 망가짐.
             */
            position: 'absolute',
            transform: `translate(calc(-50% + ${markerWidth / 2}px), 0)`,
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
