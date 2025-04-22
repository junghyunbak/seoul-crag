import { useEffect, useState } from 'react';

import { useMap } from '@/hooks';

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

              <svg width="20" viewBox="0 0 71 53" fill="none" xmlns="http://www.w3.org/2000/svg">
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
