import React, { useEffect } from 'react';

import { Box } from '@mui/material';

import { Marker, Polygon } from './overlays';
import { mapContext } from './index.context';

interface MapProps extends React.PropsWithChildren {
  map: naver.maps.Map | null;
  mapRef: React.RefObject<HTMLDivElement | null>;
}

export function Map({ map, mapRef, children }: MapProps) {
  const cragMarkers: React.ReactNode[] = [];
  const defaultMarkers: React.ReactNode[] = [];
  const cafeMarkers: React.ReactNode[] = [];
  const boundaryPolygons: React.ReactNode[] = [];
  const clusterMarkers: React.ReactNode[] = [];

  let GpsMarker: React.ReactNode | null = null;

  /**
   * pwa 환경에서 화면 비율이 변경되었을 경우, gl canvas의 크기가 업데이트 되지 않는 문제를 수정하기 위한 resize 이벤트.
   */
  useEffect(() => {
    const windowResizeEventListener = () => {
      if (!map) {
        return;
      }

      setTimeout(() => {
        const center = map.getCenter();

        naver.maps.Event.trigger(map, 'resize');

        map.setCenter(center);
      }, 500);
    };

    window.addEventListener('resize', windowResizeEventListener);

    return function cleanup() {
      window.removeEventListener('resize', windowResizeEventListener);
    };
  }, [map]);

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (child.type === Map.Marker.Crag) {
      cragMarkers.push(child);
    }

    if (child.type === Map.Marker.Default) {
      defaultMarkers.push(child);
    }

    if (child.type === Map.Marker.Cafe) {
      cafeMarkers.push(child);
    }

    if (child.type === Map.Polygon.Boundary) {
      boundaryPolygons.push(child);
    }

    if (child.type === Map.Marker.Gps) {
      GpsMarker = child;
    }

    if (child.type === Map.Marker.Cluster) {
      clusterMarkers.push(child);
    }
  });

  return (
    <mapContext.Provider value={{ map }}>
      <Box ref={mapRef} sx={{ width: '100%', height: '100%', userSelect: 'none' }}>
        <Box sx={{ display: 'none' }}>
          <Box>{cragMarkers.map((marker) => marker)}</Box>
          <Box>{cafeMarkers.map((marker) => marker)}</Box>
          <Box>{defaultMarkers.map((marker) => marker)}</Box>
          <Box>{clusterMarkers.map((marker) => marker)}</Box>
          <Box>{boundaryPolygons.map((polygon) => polygon)}</Box>
          <Box>{GpsMarker}</Box>
        </Box>
      </Box>
    </mapContext.Provider>
  );
}

Map.Marker = Marker;
Map.Polygon = Polygon;
