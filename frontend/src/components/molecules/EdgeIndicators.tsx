import { useEffect, useState } from 'react';

import { useCrewCount, useExp, useFilter, useMap, useSearch } from '@/hooks';

import { zIndex } from '@/styles';

import { Box } from '@mui/material';

interface Indicator {
  x: number;
  y: number;
  angle: number;
  count: number;
  latLng: naver.maps.Coord;
}

interface EdgeIndicatorsProps {
  crags: Crag[] | undefined | null;
  indicatorColor?: string;
  type?: 'gps' | 'crag';
}

export function EdgeIndicators({ crags, indicatorColor = '#00000065', type = 'crag' }: EdgeIndicatorsProps) {
  const [indicators, setIndicators] = useState<Indicator[]>([]);

  const { exp } = useExp();
  const { map } = useMap();
  const { crewCount } = useCrewCount();
  const { searchKeyword } = useSearch();
  const { getCragStats } = useFilter();

  useEffect(() => {
    if (!map || !map.getProjection() || !crags || !crags.length) {
      return;
    }

    const projection = map.getProjection();

    const updateIndicators = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const centerOffset = projection.fromCoordToOffset(center);

      const grouped: Record<number, Indicator> = {};

      crags.forEach((crag) => {
        const { isFiltered } = getCragStats(crag, exp.date, searchKeyword, crewCount);

        if (type === 'crag' && !isFiltered) {
          return;
        }

        const markerCoord = new naver.maps.LatLng(crag.latitude, crag.longitude);

        if ('hasLatLng' in bounds && bounds.hasLatLng(markerCoord)) {
          return;
        }

        const point = projection.fromCoordToOffset(markerCoord);
        const dx = point.x - centerOffset.x;
        const dy = point.y - centerOffset.y;

        const angleRad = Math.atan2(dy, dx);
        const angleDeg = (angleRad * 180) / Math.PI;
        const angle = (angleDeg + 450) % 360;

        const GROUP_ANGLE = 20;

        const roundedAngle = Math.round(angle / GROUP_ANGLE) * GROUP_ANGLE;

        if (!grouped[roundedAngle]) {
          // ✅ 화면 중심 기준 외부점
          const screenCenterX = window.innerWidth / 2;
          const screenCenterY = window.innerHeight / 2;
          const hugeRadius = 9999;
          const farX = screenCenterX + Math.cos(angleRad) * hugeRadius;
          const farY = screenCenterY + Math.sin(angleRad) * hugeRadius;

          // ✅ 교차점 계산
          const projected = projectToScreenEdge(farX, farY, screenCenterX, screenCenterY);

          grouped[roundedAngle] = {
            x: projected.x,
            y: projected.y,
            angle,
            count: 1,
            latLng: markerCoord,
          };
        } else {
          grouped[roundedAngle].count++;
        }
      });

      setIndicators(Object.values(grouped));
    };

    updateIndicators();

    const listener = naver.maps.Event.addListener(map, 'bounds_changed', updateIndicators);

    return () => {
      naver.maps.Event.removeListener(listener);
    };
  }, [map, crags, getCragStats, exp, type, searchKeyword, crewCount]);

  return (
    <Box>
      {indicators.map((item, i) => (
        <Box
          key={i}
          onClick={() => {
            map?.setCenter(item.latLng);
          }}
          sx={{
            position: 'fixed',
            zIndex: zIndex.edgeMarker,
            width: 'max-content',
            height: 'max-content',
            userSelect: 'none',
          }}
          style={{
            top: item.y,
            left: item.x,
          }}
        >
          <Box
            sx={{
              width: 6,
              aspectRatio: '1/1',
              borderRadius: '50%',
              background: indicatorColor,
              position: 'absolute',
              top: -3,
              left: -3,
            }}
          />
        </Box>
      ))}
    </Box>
  );
}

function projectToScreenEdge(targetX: number, targetY: number, centerX: number, centerY: number, padding = 8) {
  const dx = targetX - centerX;
  const dy = targetY - centerY;

  const tX = dx !== 0 ? (dx > 0 ? window.innerWidth - centerX : -centerX) / dx : Infinity;
  const tY = dy !== 0 ? (dy > 0 ? window.innerHeight - centerY : -centerY) / dy : Infinity;

  const t = Math.min(tX, tY);
  let x = centerX + dx * t;
  let y = centerY + dy * t;

  // ✅ 중심 방향으로 padding만큼 안쪽으로 이동
  const dist = Math.sqrt(dx * dx + dy * dy);
  const unitX = dx / dist;
  const unitY = dy / dist;

  x -= unitX * padding;
  y -= unitY * padding;

  return { x, y };
}
