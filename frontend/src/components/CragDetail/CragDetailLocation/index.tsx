import { Box, Typography, useTheme, Paper, IconButton } from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

import { Map } from '@/components/Map';

import { useEffect, useState } from 'react';

import { useNaverMap } from '@/hooks';

interface CragDetailLocationProps {
  crag: Crag;
}

export function CragDetailLocation({ crag }: CragDetailLocationProps) {
  const { map, mapRef } = useNaverMap(
    () => ({
      zoom: 15,
    }),
    []
  );

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  const theme = useTheme();

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
      <Box sx={{ width: '100%', aspectRatio: '1/1', position: 'relative' }}>
        <Map map={map} mapRef={mapRef}>
          <Map.Marker.Default onCreate={setMarker} />
        </Map>

        <Paper
          sx={{
            background: theme.palette.common.white,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '0.5rem',
            bottom: '0.5rem',
            width: 40,
            height: 40,
            zIndex: 1000,
          }}
        >
          <IconButton
            onClick={() => {
              map?.panTo(new naver.maps.LatLng(crag.latitude, crag.longitude));
            }}
          >
            <FmdGoodIcon />
          </IconButton>
        </Paper>
      </Box>
      <Typography variant="caption" color={'text.secondary'}>
        * 두 손가락을 이용한 확대/축소만 가능합니다.
      </Typography>
    </>
  );
}
