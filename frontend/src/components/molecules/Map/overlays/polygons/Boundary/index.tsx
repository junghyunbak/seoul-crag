import { useContext, useEffect, useState } from 'react';

import { useModifyMap } from '@/hooks';

import { mapContext } from '@/components/molecules/Map/index.context';

export function Boundary({
  region,
  paths,
  index,
}: {
  region: Crag['region'];
  paths: naver.maps.LatLng[][];
  index?: number;
}) {
  const { map } = useContext(mapContext);

  const { updateRegion } = useModifyMap();

  const [polygon, setPolygon] = useState<naver.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const newPolygon = new naver.maps.Polygon({
      map,
      paths: paths,
      fillColor: '#000000',
      fillOpacity: 0.1,
      strokeColor: '#000000',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      clickable: true,
    });

    setTimeout(() => {
      console.log('여전히 살아있음', index);
    }, 3000);

    setPolygon(newPolygon);

    return function cleanup() {
      console.log('죽음', index);

      //if (map && 'getLayer' in map) {
      newPolygon.setMap(null);
      //}
    };
  }, [map, paths, index]);

  useEffect(() => {
    if (!polygon) {
      return;
    }

    const handlePolygonClick = polygon.addListener('click', () => {
      updateRegion(region);
    });

    const handlePolygonMouseOver = polygon.addListener('mouseover', () => {
      console.log('디버깅', index);
      polygon.setOptions('fillColor', '#ff0000');
    });

    const handlePolygonMouseOut = polygon.addListener('mouseout', () => {
      polygon.setOptions('fillColor', '#000000');
    });

    return function cleanup() {
      polygon.removeListener(handlePolygonClick);
      polygon.removeListener(handlePolygonMouseOver);
      polygon.removeListener(handlePolygonMouseOut);
    };
  }, [index, polygon, region, updateRegion]);

  return <div />;
}
