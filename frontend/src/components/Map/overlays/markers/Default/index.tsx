import { useContext, useEffect } from 'react';

import { mapContext } from '@/components/Map/index.context';

interface DefaultProps {
  onCreate?: (marker: naver.maps.Marker) => void;
}

export function Default({ onCreate }: DefaultProps) {
  const { map } = useContext(mapContext);

  useEffect(() => {
    if (!map) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: map.getCenter(),
    });

    onCreate?.(marker);

    return function () {
      marker.setMap(null);
    };
  }, [map, onCreate]);

  return <div />;
}
