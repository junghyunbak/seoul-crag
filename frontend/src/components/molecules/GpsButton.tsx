import { IconButton, Paper } from '@mui/material';

import GpsFixedIcon from '@mui/icons-material/GpsFixed';

import { useMap, useModifyMap } from '@/hooks';
import { getGpsLatLng } from '@/utils';

export function GpsButton() {
  const { map, boundary } = useMap();

  const { updateGpsLatLng } = useModifyMap();

  return (
    <Paper
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
      }}
    >
      <IconButton
        onClick={async () => {
          if (!map) {
            return;
          }

          const gpsLatLng = await getGpsLatLng();

          if (!gpsLatLng) {
            alert('GPS를 가져올 수 없습니다.');
            return;
          }

          const latLngBounds = new naver.maps.LatLngBounds(
            new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
            new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
          );

          const latLng = new naver.maps.LatLng(gpsLatLng.lat, gpsLatLng.lng);

          updateGpsLatLng(gpsLatLng.lat, gpsLatLng.lng);

          if (latLngBounds.hasLatLng(latLng)) {
            map.panTo(latLng);
          } else {
            alert('서울 지역 밖을 벗어났습니다.');
          }
        }}
      >
        <GpsFixedIcon />
      </IconButton>
    </Paper>
  );
}
