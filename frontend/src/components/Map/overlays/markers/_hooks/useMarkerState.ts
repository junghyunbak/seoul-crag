import { useEffect, useState } from 'react';

// [ ]: cafe와 crag이 겹쳤을 때 cafe가 위로 올라오도록 구현
export function useMarkerState({
  marker,
  zoomLevel,
  isSelect,
  recognizer,
}: {
  marker: MyMarker | null;
  zoomLevel: number;
  isSelect: boolean;
  recognizer: MarkerOverlapRecognizer | null;
}) {
  const [isTitleShown, setIsTitleShown] = useState(false);
  const [zIndex, setZIndex] = useState(-1);

  /**
   * title 표시 여부
   *
   * 1. 선택중일 때
   *    1-1. 항상 표시
   * 2. 겹쳤을 때
   *    2-1. 겹친 마커 중 하나 표시
   *      2-1-1. 암장 마커가 항상 우선 표시
   *      2-1-2. 위도값이 가장 낮은 마커 표시
   */
  useEffect(() => {
    if (!marker) {
      return;
    }

    if (isSelect) {
      setIsTitleShown(true);
      return;
    }

    if (recognizer) {
      const overlapedMarkers: MyMarker[] = recognizer.getOverlapedMarkers(marker).map(({ marker }) => marker);

      const isOverlap = overlapedMarkers.length > 1;

      if (isOverlap) {
        overlapedMarkers.sort((a, b) => {
          if (a.meta?.type === 'Crag' && b.meta?.type === 'Cafe') {
            return -1;
          } else if (a.meta?.type === 'Cafe' && b.meta?.type === 'Crag') {
            return 1;
          } else {
            return (a.meta?.lat || Infinity) < (b.meta?.lat || Infinity) ? -1 : 1;
          }
        });

        if (overlapedMarkers[0] === marker) {
          setIsTitleShown(true);
        } else {
          setIsTitleShown(false);
        }
      } else {
        setIsTitleShown(true);
      }

      return;
    }

    setIsTitleShown(true);
  }, [recognizer, marker, zoomLevel, isSelect]);

  /**
   * z-index
   *
   * 1. 선택된 것
   * 2. 암장마커
   * 3. 카페 마커
   */
  useEffect(() => {
    if (isSelect) {
      setZIndex(1);
      return;
    }

    setZIndex(0);
  }, [isSelect]);

  return {
    isTitleShown,
    zIndex,
  };
}
