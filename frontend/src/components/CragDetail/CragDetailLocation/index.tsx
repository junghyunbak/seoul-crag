import { Box, Typography, useTheme, Paper, IconButton } from '@mui/material';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

import { Map } from '@/components/Map';

import { useContext, useEffect, useState } from 'react';

import { useNaverMap } from '@/hooks';
import { CragDetailContext } from '@/components/CragDetail/index.context';

export function CragDetailLocation() {
  const { crag } = useContext(CragDetailContext);

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

      <Box
        sx={{
          width: '100%',
          aspectRatio: '1.75/1',
          position: 'relative',
          borderRadius: 1,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
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
    </>
  );
}
