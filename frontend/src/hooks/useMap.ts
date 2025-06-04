import { useMemo, useRef } from 'react';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import seoulGeoData from '@/assets/jsons/seoul-geo.json';

export function useMap() {
  const [map] = useStore(useShallow((s) => [s.map]));
  const [mapRef] = useStore(useShallow((s) => [s.mapRef]));
  const [gpsLatLng] = useStore(useShallow((s) => [s.gpsLatLng]));
  const [enabledEdgeIndicator] = useStore(useShallow((s) => [s.enabledEdgeIndicator]));
  const [enabledGpsIndicator] = useStore(useShallow((s) => [s.enabledGpsIndicator]));
  const [recognizer] = useStore(useShallow((s) => [s.recognizer]));

  const lastLat = useRef(useStore.getState().lastLat).current;
  const lastLng = useRef(useStore.getState().lastLng).current;

  const boundary = useMemo(() => {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    seoulGeoData.coordinates.forEach(([lng, lat]) => {
      minLat = Math.min(minLat, lat - 0.1);
      maxLat = Math.max(maxLat, lat + 0.1);

      minLng = Math.min(minLng, lng - 0.2);
      maxLng = Math.max(maxLng, lng + 0.2);
    });

    return {
      lt: {
        y: minLat,
        x: minLng,
      },
      rb: {
        y: maxLat,
        x: maxLng,
      },
    };
  }, []);

  return { map, mapRef, boundary, gpsLatLng, lastLat, lastLng, enabledEdgeIndicator, enabledGpsIndicator, recognizer };
}
