import { createContext } from 'react';

interface MapContextValue {
  map: naver.maps.Map | null;
}

export const mapContext = createContext<MapContextValue>({ map: null });
