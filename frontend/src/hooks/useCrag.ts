import { useMemo } from 'react';

export function useCragArea(crags?: Crag[]) {
  const cragArea = useMemo(() => {
    let maxCragArea = 0;
    let minCragArea = 1000;

    (crags || []).forEach((crag) => {
      if (!crag.area) {
        return;
      }

      maxCragArea = Math.max(maxCragArea, crag.area);
      minCragArea = Math.min(minCragArea, crag.area);
    });

    return {
      minCragArea,
      maxCragArea,
    };
  }, [crags]);

  return { cragArea };
}
