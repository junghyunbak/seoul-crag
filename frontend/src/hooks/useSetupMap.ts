/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from 'react';

import { useMap } from '../hooks/useMap';
import { useModifyMap } from '../hooks/useModifyMap';

export function useSetupMap() {
  const { mapRef, boundary } = useMap();
  const { updateMap } = useModifyMap();

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const bounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
      new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
    );

    const map = new naver.maps.Map(mapRef.current, {
      // @ts-expect-error
      gl: true,
      customStyleId: '124f2743-c319-499f-8a76-feb862c54027',
      zoom: 12,
      minZoom: 10,
      maxBounds: bounds,
    });

    updateMap(map);
  }, [updateMap, mapRef, boundary]);
}
