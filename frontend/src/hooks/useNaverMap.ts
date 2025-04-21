/**
 * 외부에서 useNaverMap 훅에 대한 react-hooks/exhaustive-deps 룰을 적용하기에 무시
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';

type StyleEditorMapOptions = {
  gl?: boolean;
  customStyleId?: string;
};

export function useNaverMap(
  createMapOptions: () => naver.maps.MapOptions & Partial<StyleEditorMapOptions>,
  deps: unknown[],
  mapRef: React.RefObject<HTMLDivElement | null>
) {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const mapOptions = useMemo(createMapOptions, deps);

  useEffect(() => {
    if (!mapRef.current) {
      return function cleanup() {};
    }

    const newMap = new naver.maps.Map(mapRef.current, mapOptions);

    setMap(newMap);

    return function cleanup() {
      newMap.destroy();
    };
  }, [mapOptions, mapRef]);

  return {
    map,
  };
}
