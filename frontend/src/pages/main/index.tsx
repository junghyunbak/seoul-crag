import { useEffect } from 'react';

import { Box, Button, Stack } from '@mui/material';
import { CalendarIcon } from '@mui/x-date-pickers';
import { AccessTime } from '@mui/icons-material';

import {
  useSelectDate,
  useCrag,
  useExerciseTimeRange,
  useModifyFilter,
  useSetupCrag,
  useModifyCrag,
  useMap,
} from '@/hooks';

import { time } from '@/utils';

import { Filter } from '@/components/Filter';
import { Menu } from '@/components/Menu';
import { Controller } from '@/components/Controller';
import { Marker, Polygon } from '@/components/map/overlay';
import { Map } from '@/components/map/Map';
import AngularEdgeMarkers from '@/components/AngularEdgeMarkers';

import dayjs from 'dayjs';
import { StoryPortal } from '@/components/portals/StoryPortal';

export function Main() {
  const { selectDate } = useSelectDate();
  const { exerciseTimeRange, isUseAllTime } = useExerciseTimeRange();
  //const { filteredCrags, cragMap } = useCrag(selectDate ? dayjs(selectDate) : null, exerciseTimeRange);

  const { map } = useMap();
  const { cragMap } = useCrag();

  const { updateIsFilterSheetOpen } = useModifyFilter();
  const { updateSelectCragId } = useModifyCrag();

  useSetupCrag();

  /**
   * 앱 시작 시 랜덤으로 하나 선택
   */
  useEffect(() => {
    const crags = Object.values(cragMap);

    if (!cragMap || crags.length === 0) {
      return;
    }

    const crag = Object.values(cragMap)[Math.floor(Math.random() * crags.length)];

    updateSelectCragId(crag.id);
    map?.setCenter(new naver.maps.LatLng(crag.latitude, crag.longitude));
  }, [cragMap, updateSelectCragId, map]);

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
      <Filter />
      <Menu />
      <Controller />

      <StoryPortal imageType="interior" />

      <AngularEdgeMarkers
        markers={Object.values(cragMap).map((crag) => new naver.maps.LatLng(crag.latitude, crag.longitude))}
      />

      {Object.values(cragMap).map((crag) => (
        <Marker.CragMarker crag={crag} map={map} key={crag.id} />
      ))}

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
