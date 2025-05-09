import { useEffect, useState } from 'react';

import { useExp, useFilter, useMap } from '@/hooks';

import { zIndex } from '@/styles';

import { Box } from '@mui/material';

interface AngularIndicator {
  x: number;
  y: number;
  angle: number;
  count: number;
  latLng: naver.maps.Coord;
}

interface AngularEdgeMarkersProps {
  crags: Crag[] | undefined | null;
}

// ✅ 교차점 계산 함수
function projectToScreenEdge(targetX: number, targetY: number, centerX: number, centerY: number, padding = 5) {
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

export default function AngularEdgeMarkers({ crags }: AngularEdgeMarkersProps) {
  const [indicators, setIndicators] = useState<AngularIndicator[]>([]);

  const { exp } = useExp();
  const { getCragStats } = useFilter();
  const { map } = useMap();

  useEffect(() => {
    if (!map || !map.getProjection() || !crags || !crags.length) {
      return;
    }

    const projection = map.getProjection();

    const updateIndicators = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const centerOffset = projection.fromCoordToOffset(center);

      const grouped: Record<number, AngularIndicator> = {};

      crags.forEach((crag) => {
        const { isFiltered } = getCragStats(crag, exp.date);

        if (!isFiltered) {
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

        const GROUP_ANGLE = 30;

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
  }, [map, crags, getCragStats, exp]);

  return (
    <>
      {indicators.map((item, i) => (
        <Box
          key={i}
          onClick={() => {
            map?.setCenter(item.latLng);
          }}
          sx={{
            position: 'fixed',
            zIndex: zIndex.edgeMarker,
            pointerEvents: 'auto',
            width: 'max-content',
            height: 'max-content',
            cursor: 'pointer',
          }}
          style={{
            top: item.y,
            left: item.x,
          }}
        >
          {/**
           * arrow foreground
           */}
          <Box
            sx={{
              position: 'absolute',
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
            style={{
              transform: `rotate(${item.angle}deg)`,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                background: 'black',
                clipPath: 'polygon(50% 0%, 100% 100%, 50% 80%, 0% 100%)', //'polygon(50% 0%, 0% 50%, 100% 50%)',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
          </Box>
        </Box>
      ))}
    </>
  );
}
