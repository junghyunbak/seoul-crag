import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { Box, Typography } from '@mui/material';

import { useCrag, useModifyCrag } from '@/hooks';

import { RadialMenu } from '@/components/map/overlay/marker/CragInfoMarker';
import { SIZE } from '@/constants';

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

interface CragMarkerProps {
  map: naver.maps.Map | null;
  crag: Crag;
  onCreate?: (marker: naver.maps.Marker) => void;
}

export function CragMarker({ map, crag, onCreate }: CragMarkerProps) {
  const { selectCragId, cragArea } = useCrag();

  const { updateSelectCragId } = useModifyCrag();

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * 마커 초기화
   */
  useEffect(() => {
    if (!map) {
      return function cleanup() {};
    }

    const cragMarker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(crag.latitude, crag.longitude),
    });

    setMarker(cragMarker);

    if (onCreate) {
      onCreate(cragMarker);
    }

    return function cleanup() {
      cragMarker.setMap(null);
    };
  }, [crag, map, onCreate]);

  /**
   * 마커 아이콘 렌더링
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    const el = document.createElement('div');

    const markerWidth = getMarkerSizeFromArea(crag.area, cragArea.minCragArea, cragArea.maxCragArea);

    createRoot(el).render(
      <Box sx={{ position: 'absolute', transform: 'translate(-50%, -100%)' }}>
        <RadialMenu crag={crag} />

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
            stroke="#52634A"
            strokeWidth="4"
          />
        </svg>

        <Box
          sx={{
            position: 'absolute',
            transform: `translate(calc(-50% + ${markerWidth / 2}px), 0)`,
          }}
        >
          <Typography
            variant="h5"
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

    marker.setIcon({
      content: el,
    });
  }, [crag, cragArea, marker]);

  /**
   * 마커 이벤트 등록
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    const listener = marker.addListener('click', () => {
      updateSelectCragId(crag.id);
      map?.panTo(new naver.maps.LatLng(crag.latitude, crag.longitude));
    });

    return function cleanup() {
      marker.removeListener(listener);
    };
  }, [map, marker, crag, updateSelectCragId]);

  /*
  return (
    <>
      <CragInfoMarker crag={crag} />
    </>
  );
  */
  return <div />;
}
