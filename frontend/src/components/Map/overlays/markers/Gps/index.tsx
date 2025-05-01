import { mapContext } from '@/components/Map/index.context';
import { useMap } from '@/hooks';
import { useContext, useEffect } from 'react';

interface GpsProps {
  gpsLatLng: {
    lat: number;
    lng: number;
  };
}

export function Gps({ gpsLatLng }: GpsProps) {
  const { map } = useContext(mapContext);
  const { boundary } = useMap();

  useEffect(() => {
    if (!map || gpsLatLng.lat === -1 || gpsLatLng.lng === -1) {
      return;
    }

    const latLng = new naver.maps.LatLng(gpsLatLng.lat, gpsLatLng.lng);

    const marker = new naver.maps.Marker({
      map,
      position: latLng,
    });

    const latLngBounds = new naver.maps.LatLngBounds(
      new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
      new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
    );

    if (latLngBounds.hasLatLng(latLng)) {
      map.setCenter(latLng);
    } else {
      alert('서울 지역 밖을 벗어났습니다.');
    }

    return function cleanup() {
      marker.setMap(null);
    };
  }, [map, gpsLatLng, boundary]);

  return <div />;
}
