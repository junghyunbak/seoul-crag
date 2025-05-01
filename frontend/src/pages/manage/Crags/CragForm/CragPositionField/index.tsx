import { useContext, useState, useEffect } from 'react';

import { useQueryParam, StringParam } from 'use-query-params';

import { Box, Button } from '@mui/material';

import { useMutateCragLocation, useNaverMap } from '@/hooks';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';
import { cragsContext } from '@/pages/manage/Crags/index.context';

import { Map } from '@/components/Map';

import { QUERY_STRING } from '@/constants';

export function CragPositionField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);
  const { crags } = useContext(cragsContext);

  const [mapEnabled, setMapEnabled] = useState(false);
  const [locMarker, setLocMarker] = useState<naver.maps.Marker | null>(null);

  const { changeCragLocationMutation } = useMutateCragLocation({
    onSettled() {
      revalidateCrag();
    },
  });

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const { map, mapRef } = useNaverMap(
    () => ({
      zoom: 15,
      keyboardShortcuts: false,
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
  }, [map, locMarker, setSelectCragId]);

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
        flex: 1,
        gap: 1,
      }}
    >
      <Map map={map} mapRef={mapRef}>
        <Map.Polygon.Boundary />
        <Map.Marker.Crag crag={crag} crags={crags} onCreate={setLocMarker} />
      </Map>

      <Button variant={mapEnabled ? 'contained' : 'outlined'} onClick={handleMapLocChangeButtonClick}>
        {mapEnabled ? '수정 완료' : '위치 수정'}
      </Button>
    </Box>
  );
}
