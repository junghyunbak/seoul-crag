import { useEffect, useState } from 'react';

// TODO: zoomLevel이 1 단위가 아닌 더 세분화 필요.
// TODO: 암장의 경우, 문 닫은 암장이 zIndex값이 더 낮아야 한다.
export function useMarkerState({
  marker,
  zoomLevel,
  isSelect,
  recognizer,
}: {
  marker: naver.maps.Marker | null;
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
      const isOverlap = recognizer.getOverlapedMarkers(marker).length > 1;

      if (isOverlap) {
        setIsTitleShown(false);
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
