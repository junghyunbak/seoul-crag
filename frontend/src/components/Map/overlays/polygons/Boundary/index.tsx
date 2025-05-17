import { useMap } from '@/hooks';
import { useContext, useEffect } from 'react';

import seoulGeoData from '@/seoul-geo.json';

import { mapContext } from '@/components/Map/index.context';

export function Boundary() {
  const { map } = useContext(mapContext);
  const { boundary } = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    const newPolygon = new naver.maps.Polygon({
      map,
      paths: [
        [
          new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
          new naver.maps.LatLng(boundary.rb.y, boundary.lt.x),
          new naver.maps.LatLng(boundary.rb.y, boundary.rb.x),
          new naver.maps.LatLng(boundary.lt.y, boundary.rb.x),
          new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
        ],
        seoulGeoData.coordinates.map(([lng, lat]) => new naver.maps.LatLng(lat, lng)),
      ],
      fillColor: '#000000',
      fillOpacity: 0.1,
      strokeColor: 'transparent',
      strokeOpacity: 0,
      strokeWeight: 1,
    });

    return function cleanup() {
      const map = newPolygon.getMap();

      if (map && 'getLayer' in map) {
        newPolygon.setMap(null);
      }
    };
  }, [map, boundary]);

  return <div />;
}
