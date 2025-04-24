import React, { useEffect, useRef, useState } from 'react';

import { Box, IconButton, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, Pause, PlayArrow, Close } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

import { zIndex } from '@/styles';

import { motion, animate, useMotionValue } from 'framer-motion';

import { useDrag } from '@use-gesture/react';

import { SIZE } from '@/constants';

const DimmedMotionDiv = styled(motion.div)``;
const ContentMotionDiv = styled(motion.div)``;

interface StorySliderProps {
  contents: React.ReactNode[];
  duration?: number;
  onComplete?: () => void;
  onClose?: () => void;
  initPaused?: boolean;
}

export const StorySlider: React.FC<StorySliderProps> = ({
  contents,
  duration = 5000,
  onComplete,
  onClose,
  initPaused = false,
}) => {
  const [index, setIndex] = useState({ value: 0 });
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(initPaused);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const y = useMotionValue(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const resetTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
  };

  useEffect(() => {
    if (paused || index.value >= contents.length) return;

    resetTimers();
    const start = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);
    }, 16);

    timeoutRef.current = setTimeout(() => {
      setIndex({ value: index.value + 1 });
    }, duration);

    return resetTimers;
  }, [index, duration, contents, paused]);

  useEffect(() => {
    if (index.value === contents.length) {
      onComplete?.();
    }
  }, [contents, index, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const goPrev = () => {
    if (index.value > 0) {
      setIndex({ value: index.value - 1 });
    } else {
      setIndex({ value: index.value });
    }
  };

  const goNext = () => {
    setIndex({ value: index.value + 1 });
  };

  const pauseToggle = () => {
    setPaused((prev) => !prev);
  };

  const bind = useDrag(
    ({ last, movement: [mx, my], velocity: [, vy], memo }) => {
      // 최초 방향 판단 후 고정
      if (!memo) {
        memo = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      }

      if (memo === 'x') {
        if (last) {
          if (mx > SIZE.SWIPE_THRESHOLD_X) {
            goPrev();
          } else if (mx < -SIZE.SWIPE_THRESHOLD_X) {
            goNext();
          }
        }
      } else if (memo === 'y') {
        const nextY = Math.max(my, 0);

        y.set(nextY);

        if (last) {
          if (nextY > SIZE.CLOSE_THRESHOLD_Y || vy > 1.5) {
            onClose?.();
          } else {
            animate(y, 0);
          }
        }
      }

      return memo;
    },
    {
      axis: 'lock',
      filterTaps: true,
      pointer: { touch: true },
    }
  );

  const handleClickMobile = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const width = (e.target as HTMLDivElement).clientWidth;

    if (x < width / 2) {
      goPrev();
    } else {
      goNext();
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: zIndex.story,
      }}
    >
      <DimmedMotionDiv
        initial={{ opacity: SIZE.MIN_DIMMED_OPACITY }}
        animate={{ opacity: SIZE.MAX_DIMMED_OPACITY }}
        exit={{ opacity: SIZE.MIN_DIMMED_OPACITY }}
        transition={{ duration: 0.2 }}
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'black',
        }}
        onClick={onClose}
      />

      <ContentMotionDiv
        {...bind()}
        style={{ y }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.2 }}
        sx={{
          position: 'relative',

          boxShadow: 3,

          width: isMobile ? '100%' : 'auto',
          height: isMobile ? '100%' : '95dvh',
          aspectRatio: isMobile ? 'auto' : '9/16',

          display: 'flex',
          alignItems: 'center',

          /**
           * useDrag와의 충돌을 방지하기 위해 중요한 스타일
           */
          touchAction: 'none',
        }}
        onClick={handleClickMobile}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',

            display: 'flex',
            alignItems: 'center',

            borderRadius: isMobile ? 0 : 1,

            backgroundColor: 'black',

            pointerEvents: 'none',
          }}
        >
          {contents[Math.min(index.value, contents.length - 1)]}
        </Box>

        {/* 상단 진행 바 */}
        <Box position="absolute" top={8} left={8} right={8} display="flex" gap={0.5} zIndex={5}>
          {contents.map((_, i) => (
            <Box key={i} flex={1} height={4} borderRadius={4} bgcolor="rgba(255,255,255,0.3)" overflow="hidden">
              <Box
                height="100%"
                bgcolor="white"
                sx={{
                  width: i < index.value ? '100%' : i === index.value ? `${progress}%` : '0%',
                  transition: i === index.value ? 'width 0.1s linear' : 'none',
                }}
              />
            </Box>
          ))}
        </Box>

        {/* 닫기 + 일시정지 */}
        <Box position="absolute" top={8} right={8} display="flex" gap={1} zIndex={5}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              pauseToggle();
            }}
            sx={{ color: 'white' }}
          >
            {paused ? <PlayArrow /> : <Pause />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>

        {!isMobile && (
          <>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              sx={{ position: 'absolute', left: '-50px', zIndex: 10, color: 'white' }}
            >
              <ChevronLeft />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              sx={{ position: 'absolute', right: '-50px', zIndex: 10, color: 'white' }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </ContentMotionDiv>
    </Box>
  );
};
