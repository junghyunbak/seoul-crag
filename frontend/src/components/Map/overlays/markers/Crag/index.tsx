import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Box, Typography, IconButton } from '@mui/material';
import { Shower, CalendarMonth, EventBusy, HideImage, Image } from '@mui/icons-material';

import { useCragArea } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { motion, AnimatePresence } from 'framer-motion';

import { SIZE, QUERY_STRING } from '@/constants';
import { mapContext } from '@/components/Map/index.context';

function getMarkerSizeFromArea(area: number | null | undefined, minArea: number, maxArea: number): number {
  const MIN_AREA = minArea;
  const MAX_AREA = maxArea;
  const MIN_SIZE = SIZE.CRAG_MARKER_MIN_SIZE;
  const MAX_SIZE = SIZE.CRAG_MARKER_MAX_SIZE;

  if (area === null || area === undefined || isNaN(area)) {
    return MIN_SIZE; // null인 경우 최소 크기
  }

  // 면적 값을 10~1000 사이로 클램핑
  const clamped = Math.max(MIN_AREA, Math.min(MAX_AREA, area));

  // 정규화 (0 ~ 1)
  const ratio = (clamped - MIN_AREA) / (MAX_AREA - MIN_AREA);

  // 마커 크기로 매핑
  return MIN_SIZE + ratio * (MAX_SIZE - MIN_SIZE);
}

const BASE_ANGLE = -135;

const RADIUS = 80;

type Feature = {
  icon: React.ReactNode;
  callback: () => void;
  disabled: boolean;
};

interface CragMarkerProps {
  crag: Crag;
  crags?: Crag[];
  onCreate?: (marker: naver.maps.Marker) => void;
}

export function Crag({ crag, crags, onCreate }: CragMarkerProps) {
  const { map } = useContext(mapContext);

  const { cragArea } = useCragArea(crags);

  const markerRef = useRef<HTMLDivElement>(null);

  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);
  const [, setInteriorStory] = useQueryParam(QUERY_STRING.STORY_INTERIOR, StringParam);
  const [, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  const markerWidth = getMarkerSizeFromArea(crag.area, cragArea.minCragArea, cragArea.maxCragArea);

  const isSelect = crag.id === selectCragId;

  /**
   * 마커 초기화
   */
  useEffect(() => {
    if (!map || !markerRef.current) {
      return function cleanup() {};
    }

    const cragMarker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(crag.latitude, crag.longitude),
      icon: {
        content: markerRef.current,
      },
    });

    setMarker(cragMarker);

    if (onCreate) {
      onCreate(cragMarker);
    }

    return function cleanup() {
      cragMarker.setMap(null);
    };
  }, [crag, map, onCreate]);

  useEffect(() => {
    if (!marker) {
      return;
    }

    marker.setZIndex(isSelect ? 1 : 0);
  }, [marker, isSelect]);

  const features = useMemo<Feature[]>(() => {
    const ret: Feature[] = [];

    if (crag.imageTypes && crag.imageTypes.length > 0) {
      crag.imageTypes.forEach((type) => {
        ret.push(
          (() => {
            switch (type) {
              case 'interior':
                return {
                  icon: <Image />,
                  callback: () => {
                    setInteriorStory(crag.id);
                  },
                  disabled: false,
                };
              case 'shower':
              default:
                return {
                  icon: <Shower />,
                  callback: () => {},

                  disabled: false,
                };
            }
          })()
        );
      });
    } else {
      ret.push({
        icon: <HideImage />,
        callback: () => {},
        disabled: true,
      });
    }

    if (crag.futureSchedules && crag.futureSchedules.length > 0) {
      ret.push({
        icon: <CalendarMonth />,
        callback: () => {
          setScheduleStory(crag.id);
        },
        disabled: false,
      });
    } else {
      ret.push({
        icon: <EventBusy />,
        callback: () => {},
        disabled: true,
      });
    }

    return ret;
  }, [crag, setInteriorStory, setScheduleStory]);

  return (
    <Box ref={markerRef} sx={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}>
      <Box
        onClick={() => {
          setSelectCragId(crag.id);
          map?.panTo(new naver.maps.LatLng(crag.latitude, crag.longitude));
        }}
        sx={{ position: 'relative', color: isSelect ? 'black' : '#52634A', display: 'flex' }}
      >
        <svg width={`${markerWidth}px`} viewBox="0 0 71 53" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.18684 46.9715C1.68684 48.3049 1.88684 50.9715 6.68684 50.9715H65.6868C66.6868 50.9715 68.6868 50.1715 68.6868 46.9715L49.1868 16.4715C48.3534 15.1382 46.4868 13.2715 45.6868 16.4715L43.0618 20.4715L35.1868 32.4715L28.6868 23.9715H24.6868C21.0868 24.3715 18.8645 21.8049 18.2033 20.4715L2.18684 46.9715Z"
            fill="#8A9969"
          />
          <path
            d="M28.6868 2.97152L18.2033 20.4715C18.8645 21.8049 21.0868 24.3715 24.6868 23.9715H28.6868L35.1868 32.4715L43.0618 20.4715L32.1868 3.47152C30.5868 1.07152 29.1868 2.13819 28.6868 2.97152Z"
            fill="#F6EED6"
          />
          <path
            d="M35.1868 32.4715L28.6868 23.9715H24.6868C21.0868 24.3715 18.8645 21.8049 18.2033 20.4715M35.1868 32.4715L38.6868 36.9715C39.0201 37.4715 40.3868 38.4715 43.1868 38.4715H44.1868M35.1868 32.4715L43.0618 20.4715M18.2033 20.4715L28.6868 2.97152C29.1868 2.13819 30.5868 1.07152 32.1868 3.47152L43.0618 20.4715M18.2033 20.4715L2.18684 46.9715C1.68684 48.3049 1.88684 50.9715 6.68684 50.9715H65.6868C66.6868 50.9715 68.6868 50.1715 68.6868 46.9715L49.1868 16.4715C48.3534 15.1382 46.4868 13.2715 45.6868 16.4715L43.0618 20.4715M44.1868 38.4715H47.1868C47.0201 38.9715 46.3868 39.7715 45.1868 38.9715L44.1868 38.4715Z"
            stroke="currentColor"
            strokeWidth="4"
          />
        </svg>

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
                      '&:hover': { bgcolor: 'grey.100' },
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
          variant="h6"
          fontWeight="bold"
          sx={{
            userSelect: 'none',
            textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
          }}
        >
          {crag.name}
        </Typography>
      </Box>
    </Box>
  );
}
