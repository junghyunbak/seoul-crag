import { useState, useEffect } from 'react';

import { Box, Typography, IconButton, Stack, Divider, styled } from '@mui/material';
import Share from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import GradeOutlined from '@mui/icons-material/GradeOutlined';
import Close from '@mui/icons-material/Close';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING, SIZE } from '@/constants';

import { useFetchCrag, useFetchImages, useNaverMap } from '@/hooks';

import { Map } from '@/components/Map';
import { ScheduleTypes } from '@/components/ScheduleCalendar/ScheduleGrid';
import { engDayToKor } from '@/components/WeeklyHoursSilder';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';

import { urlService } from '@/utils';

import { Sheet } from 'react-modal-sheet';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const CustomSheet = styled(Sheet)`
  .react-modal-sheet-container {
    height: 100% !important;
    border-radius: 0 !important;
  }
`;

const dayOfPriority: Record<OpeningHourDayType, number> = {
  sunday: 1,
  monday: 2,
  tuesday: 3,
  wednesday: 4,
  thursday: 5,
  friday: 6,
  saturday: 7,
};

export default function CragDetailModal() {
  const [selectCragDetailId, setSelectCragDetailId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);

  const { crag } = useFetchCrag({ cragId: selectCragDetailId });
  const { images } = useFetchImages(selectCragDetailId, 'interior');

  const handleSheetClose = () => {
    setSelectCragDetailId(null);
  };

  return (
    <CragDetail
      isOpen={typeof selectCragDetailId === 'string'}
      onClose={handleSheetClose}
      crag={crag}
      images={images}
    />
  );
}

interface CragDetailProps {
  crag: Crag | null | undefined;
  images: Image[] | null | undefined;
  isOpen: boolean;
  onClose: () => void;
}

function CragDetail({ onClose, crag, images, isOpen }: CragDetailProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <CustomSheet
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[1]}
      initialSnap={0}
      disableDrag={false}
      dragCloseThreshold={SIZE.CLOSE_THRESHOLD_Y}
      dragVelocityThreshold={SIZE.SWIPE_THRESHOLD_X}
    >
      <Sheet.Container>
        <Sheet.Content>
          {images && crag && (
            <Sheet.Scroller>
              {/* 이미지 슬라이더 */}
              <Box sx={{ position: 'relative' }}>
                <Box ref={sliderRef} className="keen-slider" sx={{ height: 300 }}>
                  {images.map(({ url }, i) => (
                    <Box
                      key={i}
                      className="keen-slider__slide"
                      component="img"
                      src={url}
                      alt={`slide-${i}`}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ))}
                </Box>
                {/* 페이지 인디케이터 */}
                <Stack
                  direction="row"
                  justifyContent="center"
                  spacing={1}
                  sx={{ position: 'absolute', bottom: 8, width: '100%' }}
                >
                  {images &&
                    images.map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: currentSlide === i ? 'primary.main' : 'grey.400',
                          transition: 'all 0.3s',
                        }}
                      />
                    ))}
                </Stack>

                <IconButton sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }} onClick={onClose}>
                  <Close />
                </IconButton>
              </Box>

              {/* 본문 내용 */}
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                  <Typography variant="h5" fontWeight={600}>
                    {crag.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton>
                      <GradeOutlined />
                    </IconButton>
                    <IconButton>
                      <Share />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        window.location.href = `${urlService.getAbsolutePath('/manage/crags')}?${
                          QUERY_STRING.SELECT_CRAG
                        }=${crag.id}`;
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Stack>
                </Stack>

                <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }} component="pre">
                  {crag.description}
                </Typography>

                <Divider />

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    이용 시간
                  </Typography>
                  {crag.openingHourOfWeek &&
                    crag.openingHourOfWeek
                      .sort((a, b) => (dayOfPriority[a.day] < dayOfPriority[b.day] ? -1 : 1))
                      .map(({ id, day, open_time, close_time }) => {
                        if (!(open_time && close_time)) {
                          return null;
                        }

                        const [oh, om] = open_time.split(':');
                        const [ch, cm] = close_time.split(':');

                        return (
                          <Box key={id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                              {engDayToKor(day)}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >{`${oh}:${om} - ${ch}:${cm}`}</Typography>
                          </Box>
                        );
                      })}
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    일정표
                  </Typography>

                  {/**
                   * // [ ]: 미래 일정만 보여지도록 수정
                   */}
                  <ScheduleCalendar schedules={crag.futureSchedules || []} readOnly />

                  <ScheduleTypes />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    상세 위치
                  </Typography>
                  <CragLocation crag={crag} />
                </Box>
              </Box>
            </Sheet.Scroller>
          )}
        </Sheet.Content>
      </Sheet.Container>
    </CustomSheet>
  );
}

interface CragLocationProps {
  crag: Crag;
}

/**
 * portal에서 맵 ref를 연결하면 동작하지 않음.
 */
function CragLocation({ crag }: CragLocationProps) {
  const { map, mapRef } = useNaverMap(
    () => ({
      draggable: false,
      pinchZoom: false,
      scrollWheel: false,
      keyboardShortcuts: false,
      zoom: 15,
    }),
    []
  );

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (map && crag && marker) {
      const latLng = new naver.maps.LatLng(crag.latitude, crag.longitude);

      map.setCenter(latLng);
      marker.setPosition(latLng);
    }
  }, [crag, map, marker]);

  return (
    <Box sx={{ width: '100%', aspectRatio: '1/1' }}>
      <Map map={map} mapRef={mapRef}>
        <Map.Marker.Default onCreate={setMarker} />
      </Map>
    </Box>
  );
}
