import { useCallback, useEffect, useRef, useState } from 'react';

import { Box } from '@mui/material';

import {
  useCafe,
  useFetchCrags,
  useModifyCafe,
  useModifyZoom,
  useSetupCrag,
  useSetupExp,
  useSetupMarkerLoading,
  useSetupTag,
} from '@/hooks';

import { useMap, useModifyMap, useNaverMap } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { useStore } from '@/store';

import { QUERY_STRING, SIZE } from '@/constants';

import { Organisms } from '@/components/organisms';
import { Molecules } from '@/components/molecules';

const { Map } = Molecules;

const DEFAULT_LAT = 37.55296695234301;
const DEFAULT_LNG = 126.97309961038195;

export default function Main() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selectCragId, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);
  const { crags } = useFetchCrags({});
  const { cafes } = useCafe();
  const { mapRef, boundary, lastLat, lastLng } = useMap();

  const [initCragId] = useState(selectCragId);
  const [markers, setMarkers] = useState<(naver.maps.Marker | null)[]>([]);
  const [cafeMarkers, setCafeMarkers] = useState<(naver.maps.Marker | null)[]>([]);

  const { updateMap, updateRecognizer } = useModifyMap();
  const { updateZoomLevel } = useModifyZoom();
  const { updateSelectCafeId } = useModifyCafe();

  useSetupExp();
  useSetupMarkerLoading();
  useSetupCrag();
  useSetupTag();

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
      updateSelectCafeId(null);
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
  }, [map, setSelectCragId, updateSelectCafeId]);

  /**
   * bound가 변경될 때, zoom 레벨을 변경시켜 소수 단위까지 반영
   */
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const boundsChangedListener = map.addListener('bounds_changed', () => {
      if (zoomTimerRef.current) {
        clearTimeout(zoomTimerRef.current);
      }

      zoomTimerRef.current = setTimeout(() => {
        updateZoomLevel(map.getZoom());
      }, 30);
    });

    return function cleanup() {
      map.removeListener(boundsChangedListener);
    };
  }, [map, updateZoomLevel]);

  /**
   * 겹침 여부를 판단하기 위한 recognizer 초기화
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const newRecognizer = new MarkerOverlapRecognizer({
      tolerance: SIZE.TOLERANCE,
      intersectNotice: false,
      intersectList: false,
      highlightRect: false,
    });

    newRecognizer.setMap(map);

    [...markers, ...cafeMarkers].map((marker) => {
      if (!marker) {
        return;
      }

      newRecognizer.add(marker);
    });

    updateRecognizer(newRecognizer);
  }, [cafeMarkers, map, markers, updateRecognizer]);

  const handleMarkerCreate = useCallback((marker: naver.maps.Marker, idx: number, isFilter: boolean) => {
    if (idx === -1) {
      return;
    }

    setMarkers((prev) => {
      const next = [...prev];

      next[idx] = isFilter ? marker : null;

      return next;
    });
  }, []);

  const handleCafeMarkerCreate = useCallback((marker: naver.maps.Marker, idx: number) => {
    setCafeMarkers((prev) => {
      const next = [...prev];

      next[idx] = marker;

      return next;
    });
  }, []);

  const filteredMarkers = markers.filter((marker) => marker !== null);
  const filteredCafeMarkers = cafeMarkers.slice(0, cafes.length).filter((cafeMarker) => cafeMarker !== null);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
      <Map map={map} mapRef={mapRef}>
        <Map.Polygon.Boundary />
        {crags?.map((crag, i) => (
          <Map.Marker.Crag key={crag.id} crag={crag} crags={crags} onCreate={handleMarkerCreate} idx={i} forCluster />
        ))}
        {cafes?.map((cafe, i) => (
          <Map.Marker.Cafe key={cafe.id} cafe={cafe} idx={i} onCreate={handleCafeMarkerCreate} forCluster />
        ))}
        <Map.Marker.Cluster markers={filteredMarkers} />
        <Map.Marker.Cluster markers={filteredCafeMarkers} varient="cafe" maxZoom={13.5} />
        <Map.Marker.Gps />
      </Map>

      <Molecules.ConfirmModal />

      <Organisms.CragEdgeIndicators crags={crags} />
      <Organisms.GpsEdgeIndicators />

      <Organisms.MapControlBar />
      <Organisms.MapControlFooter />

      <Organisms.Notice />
      <Organisms.Sidebar />
      <Organisms.Search />
      <Organisms.FilterButtonSheet />
      <Organisms.ImageStory imageType="interior" />
      <Organisms.CalendarStory />
      <Organisms.OperationStory />
      <Organisms.ShowerStory />
      <Organisms.ProfileBottomSheet />
      <Organisms.CragDetail />
    </Box>
  );
}
