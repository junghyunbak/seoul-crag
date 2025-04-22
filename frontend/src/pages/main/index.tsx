import { Box, Button, Stack } from '@mui/material';
import { CalendarIcon } from '@mui/x-date-pickers';
import { AccessTime } from '@mui/icons-material';

import { useSelectDate, useExerciseTimeRange, useModifyFilter, useMap, useFetchCrags } from '@/hooks';

import { time } from '@/utils';

import { Menu } from '@/components/Menu';
import { Controller } from '@/components/Controller';
import { Marker, Polygon } from '@/components/map/overlay';
import { Map } from '@/components/map/Map';
import AngularEdgeMarkers from '@/components/AngularEdgeMarkers';

import dayjs from 'dayjs';

export function Main() {
  const { selectDate } = useSelectDate();
  const { exerciseTimeRange, isUseAllTime } = useExerciseTimeRange();
  const { map } = useMap();
  const { crags } = useFetchCrags();

  const { updateIsFilterSheetOpen } = useModifyFilter();

  const handleChangeDateButtonClick = () => {
    updateIsFilterSheetOpen(true);
  };

  const handleChangeExerciseButtonClick = () => {
    updateIsFilterSheetOpen(true);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
      <Map />
      <Polygon.Boundary map={map} />
      <Menu />
      <Controller />

      {crags && (
        <AngularEdgeMarkers markers={crags.map((crag) => new naver.maps.LatLng(crag.latitude, crag.longitude))} />
      )}

      {crags && (
        <div
          style={{
            display: 'none',
          }}
        >
          {crags.map((crag) => (
            <Marker.CragMarker crag={crag} map={map} key={crag.id} />
          ))}
        </div>
      )}

      <Stack
        direction="row"
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          padding: '0.5rem',
        }}
        gap="0.5rem"
      >
        <Button variant="contained" onClick={handleChangeDateButtonClick}>
          <CalendarIcon sx={{ mr: '0.5rem' }} />
          {selectDate ? dayjs(selectDate).format('YYYY년 MM월 DD일') : '전국 암장'}
        </Button>

        {selectDate !== null && (
          <Button variant="contained" onClick={handleChangeExerciseButtonClick}>
            <AccessTime sx={{ mr: '0.5rem' }} />

            {isUseAllTime
              ? '아무때나'
              : `${time.convert24ToCustom12HourFormat(exerciseTimeRange[0])} ~ ${time.convert24ToCustom12HourFormat(
                  exerciseTimeRange[1]
                )}`}
          </Button>
        )}
      </Stack>
    </Box>
  );
}
