import React from 'react';

import { Box } from '@mui/material';

import { Marker, Polygon } from '@/components/Map/overlays';

const mockCrag: Crag = {
  id: '',
  name: '',
  description: '',
  latitude: 0,
  longitude: 0,
  created_at: new Date(),
  updated_at: new Date(),
  website_url: '',
};

// [ ]: 타입 제거. Children.type 으로 대체 가능.
const CragMarkerType = (<Marker.Crag crag={mockCrag} />).type;
const DefaultMarkerType = (<Marker.Default />).type;
const BoundaryPolygonType = (<Polygon.Boundary />).type;
const ClusterMarkerType = (<Marker.Cluster markers={[]} />).type;

import { mapContext } from '@/components/Map/index.context';

function getElementsFromChildren(children: React.ReactNode, type: unknown) {
  return React.Children.toArray(children).filter((child) => React.isValidElement(child) && child.type === type);
}

interface MapProps extends React.PropsWithChildren {
  map: naver.maps.Map | null;
  mapRef: React.RefObject<HTMLDivElement | null>;
}

function MapImpl({ map, mapRef, children }: MapProps) {
  const CragMarkers = getElementsFromChildren(children, CragMarkerType);
  const DefaultMarkers = getElementsFromChildren(children, DefaultMarkerType);
  const BoundaryPolygons = getElementsFromChildren(children, BoundaryPolygonType);

  const ClusterMarkers = getElementsFromChildren(children, ClusterMarkerType);

  return (
    <mapContext.Provider value={{ map }}>
      <Box ref={mapRef} sx={{ width: '100%', height: '100%' }}>
        <Box sx={{ display: 'none' }}>
          {CragMarkers.map((CragMarker) => CragMarker)}
          {DefaultMarkers.map((DefaultMarker) => DefaultMarker)}
          {BoundaryPolygons.map((BoundayPolygon) => BoundayPolygon)}
          {ClusterMarkers.map((ClusterMarker) => ClusterMarker)}
        </Box>
      </Box>
    </mapContext.Provider>
  );
}

export const Map = Object.assign(MapImpl, {
  Marker,
  Polygon,
});
