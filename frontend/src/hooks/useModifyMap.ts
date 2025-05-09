import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifyMap() {
  const [setMap] = useStore(useShallow((s) => [s.setMap]));
  const [setGpsLatLng] = useStore(useShallow((s) => [s.setGpsLatLng]));
  const [setEnabledEdgeIndicator] = useStore(useShallow((s) => [s.setEnabledEdgeIndicator]));
  const [setEnabledGpsIndicator] = useStore(useShallow((s) => [s.setEnabledGpsIndicator]));

  const updateMap = useCallback(
    (map: naver.maps.Map) => {
      setMap(map);
    },
    [setMap]
  );

  const updateGpsLatLng = useCallback(
    (lat: number, lng: number) => {
      setGpsLatLng(lat, lng);
    },
    [setGpsLatLng]
  );

  const updateEnabledEdgeIndicator = useCallback(
    (enabled: boolean) => {
      setEnabledEdgeIndicator(enabled);
    },
    [setEnabledEdgeIndicator]
  );

  const updateEnabledGpsIndicator = useCallback(
    (enabled: boolean) => {
      setEnabledGpsIndicator(enabled);
    },
    [setEnabledGpsIndicator]
  );

  return { updateMap, updateGpsLatLng, updateEnabledEdgeIndicator, updateEnabledGpsIndicator };
}
