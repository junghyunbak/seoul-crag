import { Box, Typography } from '@mui/material';

import { Map } from '@/components/Map';

import { useEffect, useState } from 'react';

import { useNaverMap } from '@/hooks';

interface CragDetailLocationProps {
  crag: Crag;
}

export function CragDetailLocation({ crag }: CragDetailLocationProps) {
  const { map, mapRef } = useNaverMap(
    () => ({
      draggable: false,
      pinchZoom: false,
      scrollWheel: false,
      keyboardShortcuts: false,
      disableDoubleClickZoom: true,
      disableTwoFingerTapZoom: true,
      disableDoubleTapZoom: true,
      disableKineticPan: true,
      zoom: 15,
    }),
    []
  );

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (map && crag && marker) {
      const latLng = new naver.maps.LatLng(crag.latitude, crag.longitude);

      map.setCenter(latLng);
      marker.setPosition(latLng);
    }
  }, [crag, map, marker]);

  return (
    <>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        상세 위치
      </Typography>
      <Box sx={{ width: '100%', aspectRatio: '1/1' }}>
        <Map map={map} mapRef={mapRef}>
          <Map.Marker.Default onCreate={setMarker} />
        </Map>
      </Box>
    </>
  );
}
