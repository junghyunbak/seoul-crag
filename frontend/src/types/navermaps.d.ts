type HTMLString = string;

interface MarkerIconType {
  content: HTMLString;
  size?: N.Size;
  anchor?: N.Point;
}

interface MarkerClusteringOptionsType {
  // 클러스터 마커를 올릴 지도입니다.
  map?: naver.maps.Map | null;

  // 클러스터 마커를 구성할 마커입니다.
  markers?: naver.maps.Marker[];

  // 클러스터 마커 클릭 시 줌 동작 여부입니다.
  disableClickZoom?: boolean;

  // 클러스터를 구성할 최소 마커 수입니다.
  minClusterSize?: number;

  // 클러스터 마커로 표현할 최대 줌 레벨입니다. 해당 줌 레벨보다 높으면, 클러스터를 구성하고 있는 마커를 노출합니다.
  maxZoom?: number;

  // 클러스터를 구성할 그리드 크기입니다. 단위는 픽셀입니다.
  gridSize?: number;

  // 클러스터 마커의 아이콘입니다. NAVER Maps JavaScript API v3에서 제공하는 아이콘, 심볼, HTML 마커 유형을 모두 사용할 수 있습니다.
  icons?: MarkerIconType[];

  // 클러스터 마커의 아이콘 배열에서 어떤 아이콘을 선택할 것인지 인덱스를 결정합니다.
  indexGenerator?: number[];

  // 클러스터 마커의 위치를 클러스터를 구성하고 있는 마커의 평균 좌표로 할 것인지 여부입니다.
  averageCenter?: boolean;

  // 클러스터 마커를 갱신할 때 호출하는 콜백함수입니다. 이 함수를 통해 클러스터 마커에 개수를 표현하는 등의 엘리먼트를 조작할 수 있습니다.
  stylingFunction?: (clusterMarker: naver.maps.Marker, count: number) => void;
}

declare class MarkerClustering extends naver.maps.OverlayView {
  constructor(options: MarkerClusteringOptionsType);

  setMarkers(markers: naver.maps.Marker[]): void;

  getMarkers(): naver.maps.Marker[];

  destroy(): void;
}

interface MarkerOverlapRecognizerOptions {
  tolerance: number;
  intersectNotice: boolean;
  highlightRect: boolean;
}

declare class MarkerOverlapRecognizer {
  constructor(options?: Partial<MarkerOverlapRecognizerOptions>);

  setMap(map: naver.maps.Map);

  getMap(): naver.maps.Map;

  getOverlapedMarkers(
    marker: naver.maps.Marker
  ): { marker: naver.maps.Marker; rect: ReturnType<naver.maps.PointBounds.bounds> }[];

  add(marker: naver.maps.Marker);
}
