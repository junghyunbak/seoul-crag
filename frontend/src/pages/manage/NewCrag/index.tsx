import { useEffect, useState } from 'react';

import { Stack, TextField, Box, Button } from '@mui/material';

import { useNaverMap, useMutateCreateCrag } from '@/hooks';

import { urlService } from '@/utils';

import { Map } from '@/components/Map';
import { useNavigate } from 'react-router';
import { cragScheme } from '@/schemas';
import { QUERY_STRING } from '@/constants';

export function NewCrag() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigate = useNavigate();

  const { map, mapRef } = useNaverMap(
    () => ({
      zoom: 10,
    }),
    []
  );

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  const { createCragMutation } = useMutateCreateCrag({
    onSuccess(data) {
      const crag = cragScheme.parse(data);

      if (crag) {
        navigate(`${urlService.getAbsolutePath('/manage/crags')}?${QUERY_STRING.SELECT_CRAG}=${crag.id}`);
      }
    },
  });

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

  const handleCragAddButtonClick = () => {
    if (!map || !name || !description) {
      alert('필드 값 부족');
      return;
    }

    const { x, y } = map.getCenter();

    createCragMutation.mutate({ name, description, latitude: y, longitude: x });
  };

  return (
    <Stack gap={1} sx={{ alignItems: 'flex-start', p: 2 }}>
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
