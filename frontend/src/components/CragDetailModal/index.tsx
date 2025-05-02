import { useState, useEffect, useRef } from 'react';

import { Box, Typography, IconButton, Stack, Divider, styled } from '@mui/material';
import Share from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import Close from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING, SIZE } from '@/constants';

import { useFetchCrag, useFetchImages, useNaverMap } from '@/hooks';

import { Map } from '@/components/Map';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';
import { ImageWithSource } from '@/components/ImageWithSource';
import { CragDetailOpeningHours } from '@/components/CragDetailModal/CragDetailOpeningHours';
import CommentSection from '@/components/Comments';

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
  /**
   * y, x축 동시 스크롤로 인한 ux 저하 이슈 해결을 위해 비활성화
   */
  const [, /*currentSlide*/ setCurrentSlide] = useState(0);

  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setScrolledPastHero(!entry.isIntersecting);
      },
      {
        root: scrollContainerRef.current,
        threshold: 0,
      }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [isOpen]);

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
          <Sheet.Scroller ref={scrollContainerRef}>
            {/* 이미지 슬라이더 */}
            {images && images.length > 0 && (
              <Box sx={{ position: 'relative' }}>
                <Box ref={sliderRef} className="keen-slider" sx={{ height: 300 }}>
                  <ImageWithSource className="keen-slider__slide" image={images[0]} />
                </Box>
              </Box>
            )}

            <Box
              ref={sentinelRef}
              sx={{
                height: '1px',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 0,
                py: 1,
                pl: 2,
                pr: 1,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: scrolledPastHero ? 'white' : 'transparent',
                boxShadow: scrolledPastHero ? 1 : 0,
                zIndex: 1,
              }}
            >
              <Box>{scrolledPastHero && <Typography variant="h6">{crag?.name}</Typography>}</Box>

              <IconButton sx={{ color: scrolledPastHero ? 'black' : 'white' }} onClick={onClose}>
                <Close />
              </IconButton>
            </Box>

            {/* 본문 내용 */}
            {crag && (
              <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap">
                  <Typography variant="h5" fontWeight={600}>
                    {crag.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: '⛰️서울암장',
                            text: [crag.name, '', crag.description].join('\n'),
                            url: `/?${QUERY_STRING.SELECT_CRAG}=${crag.id}`,
                          });
                        }
                      }}
                    >
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

                {crag.website_url && (
                  <>
                    <Divider />

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <LanguageIcon
                        sx={{
                          fill: 'currentcolor',
                        }}
                      />

                      <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {crag.website_url}
                      </Box>

                      <IconButton onClick={() => window.open(crag.website_url || '', '_blank')}>
                        <LaunchIcon />
                      </IconButton>
                    </Box>
                  </>
                )}

                <Divider />

                <CragDetailOpeningHours crag={crag} />

                <Divider />

                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    일정표
                  </Typography>

                  {/**
                   * // [ ]: 미래 일정만 보여지도록 수정
                   */}
                  <ScheduleCalendar schedules={crag.futureSchedules || []} readOnly />
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    상세 위치
                  </Typography>
                  <CragLocation crag={crag} />
                </Box>

                <Divider />

                <CommentSection cragId={crag.id} />
              </Box>
            )}

            <Box
              sx={{
                width: '100%',
                backgroundColor: '#f9f9f9',
                borderTop: '1px solid #ddd',
                py: 2,
                px: 3,
              }}
            >
              <Typography variant="body2" fontWeight={600} gutterBottom>
                이미지 출처 및 주의사항
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.5, whiteSpace: 'normal' }}>
                서울암장 서비스에 사용된 암장 이미지는 네이버, 인스타그램 등 공개된 자료에서 수집된 것으로, 비영리적
                목적(정보 제공)을 위해 사용되고 있습니다. 이미지 사용에 문제가 있을 경우
                <strong> jeong5728@gmail.com </strong>으로 연락 주시면 즉시 조치하겠습니다.
              </Typography>
              <br />
              <br />
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                ⓒ 서울암장 – 클라이머를 위한 암장 정보 서비스
              </Typography>
            </Box>
          </Sheet.Scroller>
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
      disableDoubleClickZoom: true,
      disableTwoFingerTapZoom: true,
      disableDoubleTapZoom: true,
      disableKineticPan: true,
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
