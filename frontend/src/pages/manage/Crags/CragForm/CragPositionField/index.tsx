import { useContext, useRef, useState, useEffect } from 'react';

import { Box, Button } from '@mui/material';

import { useNaverMap } from '@/hooks';

import { api } from '@/api/axios';

import { Polygon, Marker } from '@/components/map/overlay';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { QUERY_STRING } from '@/constants';

import { useQueryParam, StringParam } from 'use-query-params';

export function CragPositionField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const mapRef = useRef<HTMLDivElement>(null);

  const [mapEnabled, setMapEnabled] = useState(false);
  const [locMarker, setLocMarker] = useState<naver.maps.Marker | null>(null);

  const [_, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const { map } = useNaverMap(
    () => ({
      zoom: 15,
    }),
    [],
    mapRef
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
    });
  }, [map, mapEnabled]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const centerChangeListener = map.addListener('center_changed', () => {
      locMarker?.setPosition(map.getCenter());
    });

    const clickListener = map.addListener('click', () => {
      setSelectCragId(null);
    });

    return function cleanup() {
      map.removeListener([centerChangeListener, clickListener]);
    };
  }, [map, locMarker, setSelectCragId]);

  const handleMapLocChangeButtonClick = async () => {
    if (mapEnabled && map) {
      const { y, x } = map.getCenter();

      await api.patch(`/gyms/${crag.id}`, {
        latitude: y,
        longitude: x,
      });

      revalidateCrag();
    }

    setMapEnabled(!mapEnabled);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { md: '400px', xs: '100%' },
        aspectRatio: '1/1',
        gap: 1,
      }}
    >
      <Box
        ref={mapRef}
        sx={{
          flex: 1,
        }}
      >
        <Marker.CragMarker crag={crag} map={map} onCreate={setLocMarker} />
        <Polygon.Boundary map={map} />
      </Box>

      <Button variant={mapEnabled ? 'contained' : 'outlined'} onClick={handleMapLocChangeButtonClick}>
        {mapEnabled ? '수정 완료' : '위치 수정'}
      </Button>
    </Box>
  );
}
