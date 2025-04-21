import { useEffect } from 'react';

import { useMap } from '../hooks/useMap';
import { useModifyMap } from '../hooks/useModifyMap';
import { useNaverMap } from '../hooks/useNaverMap';

export function useSetupMap() {
  const { mapRef, boundary } = useMap();

  const { map } = useNaverMap(
    () => ({
      gl: true,
      customStyleId: '124f2743-c319-499f-8a76-feb862c54027',
      zoom: 12,
      minZoom: 10,
      maxBounds: new naver.maps.LatLngBounds(
        new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
        new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
      ),
    }),
    [boundary],
    mapRef
  );

  const { updateMap } = useModifyMap();

  useEffect(() => {
    if (!mapRef.current || !map) {
      return;
    }

    updateMap(map);

    return function cleanup() {
      map.destroy();
    };
  }, [updateMap, map, mapRef, boundary]);
}
