import { useEffect, useRef, useState } from 'react';

import { api } from '@/api/axios';

import { Stack, TextField, Box, Button } from '@mui/material';

import { useMutation } from '@tanstack/react-query';

import { useNaverMap } from '@/hooks';

import { PATH } from '@/constants';
import { Map } from '@/components/Map';

export function NewCrag() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const mapRef = useRef<HTMLDivElement>(null);

  const { map } = useNaverMap(() => ({}), [], mapRef);

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * 맵 이벤트 등록
   *
   * - center_changed
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const listener = map.addListener('center_changed', (coord: naver.maps.Coord) => {
      marker?.setPosition(coord);
    });

    return function cleanup() {
      map.removeListener(listener);
    };
  }, [map, marker]);

  const createCragMutation = useMutation({
    mutationFn: async (
      crag: MyOmit<
        Crag,
        'id' | 'created_at' | 'updated_at' | 'thumbnail_url' | 'area' | 'futureSchedules' | 'imageTypes'
      >
    ) => {
      api.post('/gyms', crag);
    },
    onSuccess() {
      window.location.href = `${PATH.MANAGE_PAGE_PATH}/${PATH.MANAGE_PAGE_SUB_PATH_CRAGS}`;
    },
  });

  const handleCragAddButtonClick = () => {
    if (!map || !name || !description) {
      alert('필드 값 부족');
      return;
    }

    const { x, y } = map.getCenter();

    createCragMutation.mutate({ name, description, latitude: y, longitude: x });
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

      <Box
        sx={{
          width: { md: '500px', xs: '100%' },
          aspectRatio: '1/1',
        }}
      >
        <Map map={map} mapRef={mapRef}>
          <Map.Marker.Default onCreate={setMarker} />
        </Map>
      </Box>

      <Button onClick={handleCragAddButtonClick} variant="contained">
        추가
      </Button>
    </Stack>
  );
}
