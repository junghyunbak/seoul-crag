import { useEffect, useRef, useState } from 'react';

import { EditableText } from '@/components/EditableText';

import { useFetchCrag, useFetchCrags, useModifyCrag } from '@/hooks';

import { Box, Accordion, AccordionDetails, AccordionSummary, Typography, Button, Stack } from '@mui/material';

import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/axios';

import { Polygon, Marker } from '@/components/map/overlay';
import { ImageUploader } from '@/components/ImageUploader';

const MAX_AREA_VALUE = 1000;
const MIN_AREA_VALUE = 10;

export function Crags() {
  const { crags } = useFetchCrags();

  const { updateCragMap } = useModifyCrag();

  /**
   * // [ ]: 초기화 안해도 평균값 구할 수 있게 마커의 인터페이스로 넣기
   */
  useEffect(() => {
    if (!crags) {
      return;
    }

    updateCragMap(crags);
  }, [crags, updateCragMap]);

  if (!crags) {
    return null;
  }

  return (
    <div>
      <Typography variant="h3">내 암장 관리</Typography>

      {/**
       * 정렬 기준이 변경되면 순서가 달라져서 고정 필요
       *
       * // [ ]: 한번에 하나의 요소만 렌더링 하도록 구현
       */}
      {crags
        .sort((a, b) => (a.id < b.id ? -1 : 1))
        .slice(0, 1)
        .map((crag) => {
          return <CragEditForm key={crag.id} initialCrag={crag} />;
        })}
    </div>
  );
}

interface CragEditFormProps {
  initialCrag: Crag;
}

function CragEditForm({ initialCrag }: CragEditFormProps) {
  const queryClient = useQueryClient();

  const mapRef = useRef<HTMLDivElement>(null);

  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [queryEnabled, setQueryEnabled] = useState(false);
  const [mapEnabled, setMapEnabled] = useState(false);
  const [locMarker, setLocMarker] = useState<naver.maps.Marker | null>(null);

  const { crag } = useFetchCrag({
    cragId: initialCrag.id,
    enabled: queryEnabled,
    initialData: initialCrag,
  });

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = new naver.maps.Map(mapRef.current, {
      // @ts-expect-error
      gl: true,
      zoom: 15,
    });

    setMap(map);
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.setCenter(new naver.maps.LatLng(crag.latitude, crag.longitude));
  }, [map, crag]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.setOptions({
      draggable: mapEnabled,
      pinchZoom: mapEnabled,
      scrollWheel: mapEnabled,
    });
  }, [map, mapEnabled]);

  useEffect(() => {
    if (!map) {
      return;
    }

    const listener = map.addListener('center_changed', () => {
      locMarker?.setPosition(map.getCenter());
    });

    return function cleanup() {
      map.removeListener(listener);
    };
  }, [map, locMarker]);

  const handleTextFieldUpdate = async (newValue: string) => {
    await api.patch(`/gyms/${crag.id}`, {
      name: newValue,
    });

    if (!queryEnabled) {
      setQueryEnabled(true);
    }

    queryClient.invalidateQueries({ queryKey: ['crag', crag.id] });
  };

  const handleAreaFieldUpdate = async (data: string) => {
    if (isNaN(+data) || !(MIN_AREA_VALUE <= +data && +data <= MAX_AREA_VALUE)) {
      throw new Error(`${MIN_AREA_VALUE}이상 ${MAX_AREA_VALUE}사이의 숫자만 입력이 가능합니다.`);
    }

    await api.patch(`/gyms/${crag.id}`, {
      area: +data,
    });

    if (!queryEnabled) {
      setQueryEnabled(true);
    }

    queryClient.invalidateQueries({ queryKey: ['crag', crag.id] });
  };

  const handleMapLocChangeButtonClick = async () => {
    if (mapEnabled && map) {
      const { y, x } = map.getCenter();

      await api.patch(`/gyms/${crag.id}`, {
        latitude: y,
        longitude: x,
      });

      queryClient.invalidateQueries({ queryKey: ['crag', crag.id] });
    }

    setMapEnabled(!mapEnabled);
  };

  return (
    <Accordion key={crag.id}>
      <AccordionSummary>{crag.name}</AccordionSummary>

      <AccordionDetails>
        <Stack gap={1}>
          <EditableText value={crag.name} onSave={handleTextFieldUpdate} />

          <EditableText
            placeholder="암장 크기 (단위: 평, 최소: 10, 최대: 1000)"
            value={crag.area?.toString() || ''}
            onSave={handleAreaFieldUpdate}
            numberOnly
            min={MIN_AREA_VALUE}
            max={MAX_AREA_VALUE}
          />

          <Typography variant="h6">암장 내부 이미지</Typography>
          <ImageUploader imageType="interior" crag={crag} />
          <Typography variant="caption">jpeg, jpg, png 확장자만 업로드 가능합니다.</Typography>

          <Button variant={mapEnabled ? 'contained' : 'outlined'} onClick={handleMapLocChangeButtonClick}>
            {mapEnabled ? '수정 완료' : '위치 수정'}
          </Button>

          <Box
            ref={mapRef}
            sx={{
              width: { md: '500px', xs: '100%' },
              aspectRatio: '1/1',
            }}
          >
            <Marker.CragMarker crag={crag} map={map} onCreate={setLocMarker} />
            <Polygon.Boundary map={map} />
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
