import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';

import { AnimatePresence, motion } from 'framer-motion';

import { Box, Typography, IconButton, Stack, Divider } from '@mui/material';
import { Share, Edit, Close, GradeOutlined } from '@mui/icons-material';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import { useFetchCrag, useFetchImages } from '@/hooks';

import { GymScheduleGrid } from '@/components/ScheduleCalendar/ScheduleGrid';

import { urlService } from '@/utils';

import { zIndex } from '@/styles';

export function CragDetailModal() {
  const [selectCragDetailId, setSelectCragDetailId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);

  const { crag } = useFetchCrag({ cragId: selectCragDetailId });
  const { images } = useFetchImages(selectCragDetailId, 'interior');

  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return createPortal(
    <AnimatePresence>
      {selectCragDetailId && crag && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            zIndex: zIndex.cragDetail,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.4 }}
            style={{
              backgroundColor: '#fff',
              width: '100%',
              height: '100%',
              overflowY: 'auto',
            }}
          >
            {/* 이미지 슬라이더 */}
            <Box sx={{ position: 'relative' }}>
              <Box ref={sliderRef} className="keen-slider" sx={{ height: 240 }}>
                {images &&
                  images.map(({ url }, i) => (
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
            </Box>

            {/* 본문 내용 */}
            <Box sx={{ p: 3 }}>
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
                      navigate(`${urlService.getAbsolutePath('/manage/crags')}?${QUERY_STRING.SELECT_CRAG}=${crag.id}`);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'wrap' }}>
                {crag.description}
              </Typography>

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                이용 시간
              </Typography>
              <Typography variant="body2" color="text.secondary">
                평일: 10:00 - 22:00 / 주말: 10:00 - 20:00
              </Typography>

              <Box mt={4}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  일정표
                </Typography>

                <GymScheduleGrid schedules={crag.futureSchedules || []} currentMonth={new Date()} readOnly />
              </Box>
            </Box>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>,
    document.body
  );
}
