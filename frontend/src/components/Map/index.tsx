import React from 'react';

import { Box } from '@mui/material';

import { Marker, Polygon } from '@/components/Map/overlays';

import { mapContext } from '@/components/Map/index.context';

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
          {[...cragMarkers, ...cafeMarkers, ...defaultMarkers, ...clusterMarkers].map((marker) => marker)}
          {[...boundaryPolygons].map((polygon) => polygon)}
          {GpsMarker}
        </Box>
      </Box>
    </mapContext.Provider>
  );
}

Map.Marker = Marker;
Map.Polygon = Polygon;
