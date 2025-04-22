import { useEffect } from 'react';

import { Box } from '@mui/material';

import { useFetchCrags } from '@/hooks';

import { useMap, useModifyMap, useNaverMap } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { Menu } from '@/components/Menu';
import { Controller } from '@/components/Controller';
import { Map } from '@/components/Map';
import AngularEdgeMarkers from '@/components/AngularEdgeMarkers';

export function Main() {
  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const { crags } = useFetchCrags();

  const { mapRef, boundary } = useMap();

  const { map } = useNaverMap(
    () => ({
      gl: true,
      customStyleId: '124f2743-c319-499f-8a76-feb862c54027',
      zoom: 12,
      minZoom: 10,
      maxBounds: new naver.maps.LatLngBounds(
        new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
        new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
      ),
    }),
    [boundary],
    mapRef
  );

  const { updateMap } = useModifyMap();

  /**
   * 맵 객체 전역 스토어 공유
   */
  useEffect(() => {
    if (!mapRef.current || !map) {
      return;
    }

    updateMap(map);
  }, [updateMap, map, mapRef]);

  /**
   * 이벤트 등록
   *
   * - click
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const mapClickListener = map.addListener('click', () => {
      setSelectCragId(null);
    });

    return function cleanup() {
      map.removeListener(mapClickListener);
    };
  }, [map, setSelectCragId]);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
      <Map map={map} mapRef={mapRef}>
        <Map.Polygon.Boundary />
        {crags?.map((crag) => (
          <Map.Marker.Crag key={crag.id} crag={crag} crags={crags} />
        ))}
      </Map>

      <Menu />

      <Controller />

      {crags && (
        <AngularEdgeMarkers markers={crags.map((crag) => new naver.maps.LatLng(crag.latitude, crag.longitude))} />
      )}
    </Box>
  );
}

/*
      <Stack
        direction="row"
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          padding: '0.5rem',
        }}
        gap="0.5rem"
      >
        <Button variant="contained" onClick={handleChangeDateButtonClick}>
          <CalendarIcon sx={{ mr: '0.5rem' }} />
          {selectDate ? dayjs(selectDate).format('YYYY년 MM월 DD일') : '전국 암장'}
        </Button>

        {selectDate !== null && (
          <Button variant="contained" onClick={handleChangeExerciseButtonClick}>
            <AccessTime sx={{ mr: '0.5rem' }} />

            {isUseAllTime
              ? '아무때나'
              : `${time.convert24ToCustom12HourFormat(exerciseTimeRange[0])} ~ ${time.convert24ToCustom12HourFormat(
                  exerciseTimeRange[1]
                )}`}
          </Button>
        )}
      </Stack>
      */
