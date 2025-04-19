import { api } from '@/api/axios';
import { Stack, TextField, Box, Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

// [ ]: react-hook-form 도입
export function NewCrag() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return function cleanup() {};
    }

    const newMap = new naver.maps.Map(mapRef.current, {
      // @ts-expect-error
      gl: true,
    });

    setMap(newMap);
  }, []);

  useEffect(() => {
    if (!map) {
      return;
    }

    // [ ]: 디바운싱
    const listener = map.addListener('center_changed', (coord: naver.maps.Coord) => {
      marker?.setPosition(coord);
    });

    return function cleanup() {
      map.removeListener(listener);
    };
  }, [map, marker]);

  useEffect(() => {
    if (!map) {
      return function cleanup() {};
    }

    const newMarker = new naver.maps.Marker({
      map,
      position: map.getCenter(),
    });

    setMarker(newMarker);
  }, [map]);

  const createCragMutation = useMutation({
    mutationFn: async (crag: MyOmit<Crag, 'id' | 'created_at' | 'updated_at'>) => {
      api.post('/gyms', crag);
    },
    onSuccess() {
      navigate('/manage/crags');
    },
  });

  const handleCragAddButtonClick = () => {
    // [ ]: 유효성 검사에 따른 UI 알림 추가
    if (!map || !name || !description) {
      alert('필드 값 부족');
      return;
    }

    const { x, y } = map.getCenter();

    // [ ]: 썸네일 필드 추가
    createCragMutation.mutate({ name, description, latitude: y, longitude: x, thumbnail_url: '' });
  };

  return (
    <Stack gap={1} sx={{ alignItems: 'flex-start' }}>
      <TextField
        label="암장 이름"
        variant="outlined"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        required
      />
      <TextField
        label="암장 소개"
        variant="outlined"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        multiline
      />

      <Box ref={mapRef} sx={{ width: { md: '500px', xs: '100%' }, aspectRatio: '1/1' }} />

      <Button onClick={handleCragAddButtonClick} variant="contained">
        추가
      </Button>
    </Stack>
  );
}
