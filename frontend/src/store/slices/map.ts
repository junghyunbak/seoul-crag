import { StateCreator } from 'zustand';

type MapSliceType = {
  map: naver.maps.Map | null;
  setMap: (map: naver.maps.Map) => void;

  mapRef: React.RefObject<HTMLDivElement | null>;

  lastLat: number;
  setLastLat: (lat: number) => void;

  lastLng: number;
  setLastLng: (lng: number) => void;

  gpsLatLng: { lat: number; lng: number };
  setGpsLatLng: (lat: number, lng: number) => void;

  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;

  enabledEdgeIndicator: boolean;
  setEnabledEdgeIndicator: (enabled: boolean) => void;

  enabledGpsIndicator: boolean;
  setEnabledGpsIndicator: (enabled: boolean) => void;
};

export const createMapSlice: StateCreator<MapSliceType> = (set): MapSliceType => ({
  map: null,
  setMap(map) {
    set(() => ({ map }));
  },

  mapRef: { current: null },

  lastLat: -1,
  setLastLat(lat) {
    set(() => ({ lastLat: lat }));
  },

  lastLng: -1,
  setLastLng(lng) {
    set(() => ({ lastLng: lng }));
  },

  gpsLatLng: {
    lat: -1,
    lng: -1,
  },
  setGpsLatLng(lat, lng) {
    set(() => ({ gpsLatLng: { lat, lng } }));
  },

  zoomLevel: 12,
  setZoomLevel(zoomLevel) {
    set(() => ({ zoomLevel }));
  },

  enabledEdgeIndicator: false,
  setEnabledEdgeIndicator(enabled) {
    set(() => ({ enabledEdgeIndicator: enabled }));
  },

  enabledGpsIndicator: true,
  setEnabledGpsIndicator(enabled) {
    set(() => ({ enabledGpsIndicator: enabled }));
  },
});
