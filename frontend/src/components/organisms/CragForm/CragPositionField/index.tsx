import { useContext, useState, useEffect } from 'react';

import { Box, Button } from '@mui/material';

import { useMap, useMutateCragLocation, useNaverMap } from '@/hooks';

import { cragFormContext } from '@/components/organisms/CragForm/index.context';

import { Molecules } from '@/components/molecules';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

const { Map } = Molecules;

export function CragPositionField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { boundary } = useMap();

  const [mapEnabled, setMapEnabled] = useState(false);
  const [locMarker, setLocMarker] = useState<naver.maps.Marker | null>(null);

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

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
    [boundary]
  );

  /**
   * 지도 위치 초기화
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    map.setCenter(new naver.maps.LatLng(crag.latitude, crag.longitude));
  }, [map, crag]);

  /**
   * 지도 활성/비활성화
   */
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

  /**
   * - 클릭 시 마커 선택 해제
   * - 마커 위치 중앙 동기화
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const mapClickListener = map.addListener('click', () => {
      setSelectCragId(null);
    });

    const centerChangeListener = map.addListener('center_changed', () => {
      locMarker?.setPosition(map.getCenter());
    });

    return function cleanup() {
      map.removeListener(centerChangeListener);
      map.removeListener(mapClickListener);
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
          <Map.Marker.Crag crag={crag} onCreate={setLocMarker} />
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
