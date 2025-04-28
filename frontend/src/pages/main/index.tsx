import { useCallback, useEffect, useRef, useState } from 'react';

import { Box, CircularProgress } from '@mui/material';

import { useFetchCrags } from '@/hooks';

import { useMap, useModifyMap, useNaverMap } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { Map } from '@/components/Map';
import { Controller } from '@/components/Controller';
import { Menu } from '@/components/Menu';
import AngularEdgeMarkers from '@/components/AngularEdgeMarkers';
import { Filter } from '@/components/Filter';

import { useStore } from '@/store';

const DEFAULT_LAT = 37.55296695234301;
const DEFAULT_LNG = 126.97309961038195;

export default function Main() {
  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const [initCragId] = useState(selectCragId);

  const { crags } = useFetchCrags();

  const { mapRef, boundary } = useMap();

  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { map } = useNaverMap(
    () => {
      const { lastLat, lastLng } = useStore.getState();

      return {
        gl: true,
        customStyleId: '124f2743-c319-499f-8a76-feb862c54027',
        zoom: 12,
        minZoom: 10,
        center: new naver.maps.LatLng(lastLat !== -1 ? lastLat : DEFAULT_LAT, lastLng !== -1 ? lastLng : DEFAULT_LNG),
        maxBounds: new naver.maps.LatLngBounds(
          new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
          new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
        ),
      };
    },
    [boundary],
    mapRef
  );

  const { updateMap } = useModifyMap();

  /**
   * 기존에 선택된 마커가 있다면 이동
   */
  useEffect(() => {
    if (initCragId && map) {
      const crag = crags?.find(({ id }) => id === initCragId);

      if (crag) {
        map.setCenter(new naver.maps.LatLng(crag.latitude, crag.longitude));
      }
    }
  }, [initCragId, map, crags]);

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
   *    - 선택된 마커 해제
   *
   * - center change
   *    - 마지막 저장위치 기억
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const mapClickListener = map.addListener('click', () => {
      setSelectCragId(null);
    });

    const centerChangeListener = map.addListener('center_changed', () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const { y, x } = map.getCenter();

        useStore.getState().setLastLat(y);
        useStore.getState().setLastLng(x);
      }, 500);
    });

    return function cleanup() {
      map.removeListener(mapClickListener);
      map.removeListener(centerChangeListener);
    };
  }, [map, setSelectCragId]);

  const handleMarkerCreate = useCallback((marker: naver.maps.Marker, idx: number) => {
    if (idx === -1) {
      return;
    }

    setMarkers((prev) => {
      const next = [...prev];

      next[idx] = marker;

      return next;
    });
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
      <Map map={map} mapRef={mapRef}>
        <Map.Polygon.Boundary />
        {crags?.map((crag, i) => (
          <Map.Marker.Crag key={crag.id} crag={crag} crags={crags} onCreate={handleMarkerCreate} idx={i} forCluster />
        ))}
        <Map.Marker.Cluster markers={markers} />
      </Map>

      <Menu />

      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
        }}
      >
        <Controller />
      </Box>
      <MapLoading />
      <Filter />
      {markers && <AngularEdgeMarkers markers={markers} />}
    </Box>
  );
}

function MapLoading() {
  const { map } = useMap();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!map) {
      return;
    }

    const dragStartListener = map.addListener('dragstart', () => {
      setIsLoading(true);
    });

    const dragEndListener = map.addListener('dragend', () => {
      setIsLoading(false);
    });

    const zoomStartListener = map.addListener('zoomstart', () => {
      setIsLoading(true);
    });

    const zoomEndListener = map.addListener('zoomend', () => {
      setIsLoading(false);
    });

    return function cleanup() {
      map.removeListener(dragStartListener);
      map.removeListener(dragEndListener);
      map.removeListener(zoomStartListener);
      map.removeListener(zoomEndListener);
    };
  }, [map]);

  return <Box sx={{ position: 'fixed', top: 0, right: 0 }}>{isLoading && <CircularProgress />}</Box>;
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
