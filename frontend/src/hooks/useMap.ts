import { useMemo, useRef } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function useMap() {
  const [map] = useStore(useShallow((s) => [s.map]));
  const [mapRef] = useStore(useShallow((s) => [s.mapRef]));
  const [gpsLatLng] = useStore(useShallow((s) => [s.gpsLatLng]));
  const [enabledEdgeIndicator] = useStore(useShallow((s) => [s.enabledEdgeIndicator]));
  const [enabledGpsIndicator] = useStore(useShallow((s) => [s.enabledGpsIndicator]));
  const [recognizer] = useStore(useShallow((s) => [s.recognizer]));

  const lastLat = useRef(useStore.getState().lastLat).current;
  const lastLng = useRef(useStore.getState().lastLng).current;

  const [region] = useStore(useShallow((s) => [s.region]));

  const boundary = useMemo(() => {
    return {
      lt: {
        y: 38.612,
        x: 124.6,
      },
      rb: {
        y: 33.1,
        x: 131.87,
      },
    };
  }, []);

  return {
    map,
    mapRef,
    boundary,
    gpsLatLng,
    lastLat,
    lastLng,
    enabledEdgeIndicator,
    enabledGpsIndicator,
    recognizer,
    region,
  };
}
