import { useEffect, useState } from 'react';

import { useMap } from '@/hooks';

import { CragIcon } from '@/components/CragIcon';

import './index.css';

interface AngularIndicator {
  x: number;
  y: number;
  angle: number;
  count: number;
  latLng: naver.maps.Coord;
}

interface AngularEdgeMarkersProps {
  markers: naver.maps.Marker[];
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

export default function AngularEdgeMarkers({ markers }: AngularEdgeMarkersProps) {
  const [indicators, setIndicators] = useState<AngularIndicator[]>([]);

  const { map } = useMap();

  useEffect(() => {
    if (!map || !markers.length || !map.getProjection()) return;

    const projection = map.getProjection();

    const updateIndicators = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const centerOffset = projection.fromCoordToOffset(center);

      const grouped: Record<number, AngularIndicator> = {};

      markers.forEach((marker) => {
        const markerCoord = marker.getPosition();

        if ('hasLatLng' in bounds && bounds.hasLatLng(markerCoord)) return;

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
  }, [map, markers]);

  return (
    <>
      {indicators.map((item, i) => (
        <div
          key={i}
          className="marker-wrapper"
          onClick={() => {
            map?.setCenter(item.latLng);
          }}
          style={{
            position: 'fixed',
            top: item.y,
            left: item.x,
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          <div className="tail-wrapper" style={{ '--angle': `${item.angle}deg` } as React.CSSProperties}>
            <div className="tail-bg" />
          </div>

          <div
            className="balloon"
            style={{
              color: '#56654b',
              width: '60px',
              height: '50px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,

                background: '#f7ead6',
                overflow: 'hidden',

                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

                gap: '0.5rem',

                zIndex: 10000,
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                }}
              >
                {item.count}
              </p>

              <CragIcon width={20} />
            </div>
          </div>

          <div className="tail-wrapper" style={{ '--angle': `${item.angle}deg` } as React.CSSProperties}>
            <div className="tail" />
          </div>
        </div>
      ))}
    </>
  );
}
