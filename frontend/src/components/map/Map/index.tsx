import { useEffect } from 'react';

import { Box } from '@mui/material';

import { useMap, useModifyMap, useNaverMap } from '@/hooks';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

export function Map() {
  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);
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

  return <Box ref={mapRef} sx={{ width: '100%', height: '100%' }} />;
}
