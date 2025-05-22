import { useEffect, useState } from 'react';

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
    const overlapedMarkers = (() => {
      if (!recognizer || !marker) {
        return [];
      }

      const overlapedMarkers: MyMarker[] = recognizer.getOverlapedMarkers(marker).map(({ marker }) => marker);

      overlapedMarkers.sort((a, b) => {
        if (a.meta?.type === 'Crag' && b.meta?.type === 'Cafe') {
          return -1;
        } else if (a.meta?.type === 'Cafe' && b.meta?.type === 'Crag') {
          return 1;
        } else {
          return (a.meta?.lat || Infinity) < (b.meta?.lat || Infinity) ? -1 : 1;
        }
      });

      return overlapedMarkers;
    })();

    if (!marker) {
      return;
    }

    if (isSelect) {
      setIsTitleShown(true);
      return;
    }

    if (overlapedMarkers.length <= 0) {
      setIsTitleShown(true);
      return;
    }

    setIsTitleShown(overlapedMarkers[0] === marker);
  }, [marker, isSelect, recognizer, zoomLevel]);

  /**
   * z-index
   *
   * [우선순위]
   * 1. 선택된 것
   * 2. 암장마커
   * 3. 카페 마커
   */
  useEffect(() => {
    if (isSelect) {
      setZIndex(2);
      return;
    }

    if (marker?.meta?.type === 'Crag') {
      setZIndex(1);
      return;
    }

    setZIndex(0);
  }, [isSelect, marker]);

  return {
    isTitleShown,
    zIndex,
  };
}
