import { useCallback, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import { useFetchCrags, useModifyZoom } from '@/hooks';

import { useMap, useModifyMap, useNaverMap } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { useStore } from '@/store';

import { QUERY_STRING } from '@/constants';

import { Map } from '@/components/Map';
import { Menu } from '@/components/Menu';
import { Search } from '@/components/Search';
import { Topbar } from './_components/Topbar';
import { Footer } from './_components/Footer';

const DEFAULT_LAT = 37.55296695234301;
const DEFAULT_LNG = 126.97309961038195;

export default function Main() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);
  const { crags } = useFetchCrags();
  const { mapRef, boundary, lastLat, lastLng } = useMap();

  const [initCragId] = useState(selectCragId);
  const [markers, setMarkers] = useState<naver.maps.Marker[]>([]);

  const { updateMap } = useModifyMap();
  const { updateZoomLevel } = useModifyZoom();

  const { map } = useNaverMap(
    () => {
      return {
        gl: true,
        customStyleId: '124f2743-c319-499f-8a76-feb862c54027',
        zoom: useStore.getState().zoomLevel,
        minZoom: 10,
        center: new naver.maps.LatLng(lastLat !== -1 ? lastLat : DEFAULT_LAT, lastLng !== -1 ? lastLng : DEFAULT_LNG),
        maxBounds: new naver.maps.LatLngBounds(
          new naver.maps.LatLng(boundary.lt.y, boundary.lt.x),
          new naver.maps.LatLng(boundary.rb.y, boundary.rb.x)
        ),
      };
    },
    [boundary, lastLat, lastLng],
    mapRef
  );

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

  /**
   * 맵 줌 레벨 변경 시 반영
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const zoomChangedListener = map.addListener('zoom_changed', (zoom: number) => {
      updateZoomLevel(zoom);
    });

    return function cleanup() {
      map.removeListener(zoomChangedListener);
    };
  }, [map, updateZoomLevel]);

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
      <Topbar />
      <Map map={map} mapRef={mapRef}>
        <Map.Polygon.Boundary />
        {crags?.map((crag, i) => (
          <Map.Marker.Crag key={crag.id} crag={crag} crags={crags} onCreate={handleMarkerCreate} idx={i} forCluster />
        ))}
        <Map.Marker.Cluster markers={markers} />
        <Map.Marker.Gps />
      </Map>
      <Footer />

      <Menu />
      <Search />
    </Box>
  );
}
