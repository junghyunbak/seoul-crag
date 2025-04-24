/**
 * 외부에서 useNaverMap 훅에 대한 react-hooks/exhaustive-deps 룰을 적용하기에 무시
 */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useRef } from 'react';

type StyleEditorMapOptions = {
  gl: boolean;
  customStyleId: string;
};

export function useNaverMap(
  createMapOptions: () => naver.maps.MapOptions & Partial<StyleEditorMapOptions>,
  deps: unknown[],
  customMapRef?: React.RefObject<HTMLDivElement | null>
) {
  const mapRef = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const mapOptions = useMemo(createMapOptions, deps);

  useEffect(() => {
    const ref = (customMapRef && customMapRef.current) || mapRef.current;

    if (!ref) {
      return function cleanup() {};
    }

    const newMap = new naver.maps.Map(ref, mapOptions);

    setMap(newMap);

    return function cleanup() {
      newMap.destroy();
    };
  }, [mapOptions, mapRef]);

  return {
    map,
    mapRef,
  };
}
