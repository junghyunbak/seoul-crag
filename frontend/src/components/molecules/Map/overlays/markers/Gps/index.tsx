import { useContext, useEffect, useRef } from 'react';

import { mapContext } from '@/components/molecules/Map/index.context';

import { useMap } from '@/hooks';

import { Box } from '@mui/material';

export function Gps() {
  const { map } = useContext(mapContext);
  const { boundary, gpsLatLng } = useMap();

  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map || gpsLatLng.lat === -1 || gpsLatLng.lng === -1 || !markerRef.current) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(gpsLatLng.lat, gpsLatLng.lng),
      icon: {
        content: markerRef.current,
      },
    });

    return function cleanup() {
      marker.setMap(null);
    };
  }, [map, gpsLatLng, boundary]);

  return (
    <Box
      ref={markerRef}
      sx={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          borderRadius: '50%',
          width: '30px',
          aspectRatio: '1/1',
          background: '#afd9f1a1',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          borderRadius: '50%',
          width: '15px',
          aspectRatio: '1/1',
          background: '#44a1f6',
          border: '1px solid white',
          boxShadow: '0px 0px 4px 2px rgba(0, 0, 0, 0.2)',
        }}
      />
    </Box>
  );
}
