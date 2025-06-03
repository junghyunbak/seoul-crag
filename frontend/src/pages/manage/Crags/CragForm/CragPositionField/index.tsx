import { useContext, useState, useEffect } from 'react';

import { Box, Button } from '@mui/material';

import { useMap, useMutateCragLocation, useNaverMap } from '@/hooks';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { cragsContext } from '@/pages/manage/Crags/index.context';

import { Map } from '@/components/Map';
import { Molecules } from '@/components/molecules';

export function CragPositionField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);
  const { crags } = useContext(cragsContext);

  const { boundary } = useMap();

  const [mapEnabled, setMapEnabled] = useState(false);
  const [locMarker, setLocMarker] = useState<naver.maps.Marker | null>(null);

  const { changeCragLocationMutation } = useMutateCragLocation({
    onSettled() {
      revalidateCrag();
    },
  });

  const { map, mapRef } = useNaverMap(
    () => ({
      zoom: 15,
      keyboardShortcuts: false,
      maxBounds: new naver.maps.LatLngBounds(
        new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
        new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
      ),
    }),
    []
  );

  useEffect(() => {
    if (!map) {
      return;
    }

    map.setCenter(new naver.maps.LatLng(crag.latitude, crag.longitude));
  }, [map, crag]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.setOptions({
      draggable: mapEnabled,
      pinchZoom: mapEnabled,
      scrollWheel: mapEnabled,
      keyboardShortcuts: mapEnabled,
      disableDoubleClickZoom: !mapEnabled,
      disableTwoFingerTapZoom: !mapEnabled,
      disableDoubleTapZoom: !mapEnabled,
      disableKineticPan: !mapEnabled,
    });
  }, [map, mapEnabled]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const centerChangeListener = map.addListener('center_changed', () => {
      locMarker?.setPosition(map.getCenter());
    });

    return function cleanup() {
      map.removeListener(centerChangeListener);
    };
  }, [map, locMarker]);

  const handleMapLocChangeButtonClick = async () => {
    if (mapEnabled && map) {
      const { y, x } = map.getCenter();

      changeCragLocationMutation.mutate({
        cragId: crag.id,
        latitude: y,
        longitude: x,
      });
    }

    setMapEnabled(!mapEnabled);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 1,
      }}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          width: '100%',
          aspectRatio: '1/1',
          position: 'relative',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        })}
      >
        <Map map={map} mapRef={mapRef}>
          <Map.Polygon.Boundary />
          <Map.Marker.Crag crag={crag} crags={crags} onCreate={setLocMarker} />
        </Map>

        <Box
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
          }}
        >
          <Molecules.CragInteriorPreview />
        </Box>
      </Box>

      <Button variant={mapEnabled ? 'contained' : 'outlined'} onClick={handleMapLocChangeButtonClick}>
        {mapEnabled ? '수정 완료' : '위치 수정'}
      </Button>
    </Box>
  );
}
