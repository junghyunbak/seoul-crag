import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Box, Typography, IconButton, Stack, Divider } from '@mui/material';
import Share from '@mui/icons-material/Share';
import Edit from '@mui/icons-material/Edit';
import Close from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFetchCrag, useFetchImages, useFilter } from '@/hooks';

import { Schedule } from '@/components/Schedule';
import { ScheduleMonthNavigation } from '@/components/ScheduleMonthNavigation';
import { ImageWithSource } from '@/components/ImageWithSource';

import { CragDetailOpeningHours } from '@/components/CragDetail/CragDetailOpeningHours';
import { CragDetailComment } from './CragDetailComments';
import { CragDetailLocation } from './CragDetailLocation';

import { AnimatePresence, motion } from 'framer-motion';

import { subMonths, addMonths } from 'date-fns';

import { urlService } from '@/utils';

import { zIndex } from '@/styles';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export default function CragDetail() {
  const [selectCragDetailId, setSelectCragDetailId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);

  const { crag } = useFetchCrag({ cragId: selectCragDetailId });
  const { images } = useFetchImages(selectCragDetailId, 'interior');

  const handleSheetClose = () => {
    setSelectCragDetailId(null);
  };

  return createPortal(
    <AnimatePresence>
      {typeof selectCragDetailId === 'string' && (
        <CragDetailContent onClose={handleSheetClose} crag={crag} images={images} />
      )}
    </AnimatePresence>,
    document.body
  );
}

interface CragDetailContentProps {
  crag: Crag | null | undefined;
  images: Image[] | null | undefined;
  onClose: () => void;
}

function CragDetailContent({ onClose, crag, images }: CragDetailContentProps) {
  const { expeditionDate } = useFilter();

  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [currentMonth, setCurrentMonth] = useState(expeditionDate);

  /**
   * y, x축 동시 스크롤로 인한 ux 저하 이슈 해결을 위해 슬라이드 비활성화.
   */
  const [, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  /**
   * 선택된 날짜에 따라 시작 달력 월 변경
   */
  useEffect(() => {
    setCurrentMonth(expeditionDate);
  }, [expeditionDate]);

  /**
   * 상단바 스타일 조정을 위한 observer 등록
   */
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
  }, []);

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: zIndex.cragDetail,
        background: 'white',
      }}
      ref={scrollContainerRef}
    >
      {/* 상단바 */}
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

      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          position: 'relative',
          '::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {/* 이미지 슬라이더 */}
        {images && images.length > 0 && (
          <Box sx={{ position: 'relative' }}>
            <Box ref={sliderRef} className="keen-slider" sx={{ height: 300 }}>
              <ImageWithSource className="keen-slider__slide" image={images[0]} />
            </Box>
          </Box>
        )}

        {/* 상단바 스타일 조정을 위한 sentinel */}
        <Box
          ref={sentinelRef}
          sx={{
            height: '1px',
          }}
        />

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

              <ScheduleMonthNavigation
                currentMonth={currentMonth}
                onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
              />
              <Schedule
                currentMonth={currentMonth}
                schedules={crag.futureSchedules || []}
                onScheduleElementClick={() => {}}
                readOnly
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                상세 위치
              </Typography>
              <CragDetailLocation crag={crag} />
            </Box>

            <Divider />

            <CragDetailComment cragId={crag.id} />
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
      </Box>
    </motion.div>
  );
}
