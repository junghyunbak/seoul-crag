import { useEffect, useState } from 'react';

import { useFilter, useMap } from '@/hooks';

import { CragIcon } from '@/components/CragIcon';

import { zIndex } from '@/styles';

import { Box, Typography } from '@mui/material';

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
function projectToScreenEdge(targetX: number, targetY: number, centerX: number, centerY: number, padding = 50) {
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

  const { isCragFiltered } = useFilter();
  const { map } = useMap();

  useEffect(() => {
    if (!map || !crags || !crags.length || !map.getProjection()) return;

    const projection = map.getProjection();

    const updateIndicators = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const centerOffset = projection.fromCoordToOffset(center);

      const grouped: Record<number, AngularIndicator> = {};

      crags.forEach((crag) => {
        if (!isCragFiltered(crag)) {
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

        const roundedAngle = Math.round(angle / 10) * 10;

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
  }, [map, crags, isCragFiltered]);

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
            top: item.y,
            left: item.x,
            zIndex: zIndex.edgeMarker,

            transform: 'translate(-50%, -50%)',

            pointerEvents: 'auto',

            width: 'max-content',
            height: 'max-content',

            cursor: 'pointer',
          }}
        >
          {/**
           * arrow background
           */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `rotate(${item.angle}deg)`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                width: '21px',
                height: '21px',

                backgroundColor: '#56654b',

                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'translate(-50%, -180%)',

                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -1,
              }}
            />
          </Box>

          {/**
           * content (border)
           */}
          <Box
            sx={{
              width: '50px',
              height: '46px',

              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',

              background: '#f7ead6',

              border: '3px solid #56654b',
              borderRadius: 1,

              position: 'relative',

              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',

              overflow: 'hidden',
            }}
          >
            {/**
             * content (main)
             */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,

                background: '#f7ead6',
                overflow: 'hidden',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                gap: '0.25rem',

                zIndex: 1,
              }}
            >
              <Typography
                style={{
                  color: '#56654b',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  userSelect: 'none',
                }}
              >
                {item.count}
              </Typography>

              <CragIcon width={18} />
            </Box>
          </Box>

          {/**
           * arrow foreground
           */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: `rotate(${item.angle}deg)`,
              transformOrigin: 'center center',
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                width: '18px',
                height: '18px',
                background: '#7e9468',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                transform: 'translate(-50%, -180%)',
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
