import React, { useEffect, useRef, useState } from 'react';

import { Box, IconButton, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, Pause, PlayArrow, Close } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

import { zIndex } from '@/styles';

import { motion, animate, useMotionValue, useTransform } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

const DimmedMotionDiv = styled(motion.div)``;
const ContentMotionDiv = styled(motion.div)``;

const MAX_DIMMED_OPACITY = 0.9;
const MIN_DIMMED_OPACITY = 0.3;

const CLOSE_THRESHOLD = 400;

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
  const backdropOpacity = useTransform(y, [0, CLOSE_THRESHOLD], [MAX_DIMMED_OPACITY, MIN_DIMMED_OPACITY]);

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

  const handlePrev = () => {
    if (index.value > 0) {
      setIndex({ value: index.value - 1 });
    } else {
      setIndex({ value: index.value });
    }
  };

  const handleNext = () => {
    setIndex({ value: index.value + 1 });
  };

  const handlePauseToggle: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setPaused((prev) => !prev);
  };

  const bind = useDrag(
    ({ last, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], cancel, memo }) => {
      // 최초 방향 판단 후 고정
      if (!memo) {
        memo = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      }

      if (memo === 'x') {
        if (last) {
          if (mx > 50) handlePrev();
          else if (mx < -50) handleNext();
        }
      } else if (memo === 'y') {
        y.set(my);
        if (last) {
          if (my > 100 || vy > 1.5) onClose?.();
          else animate(y, 0);
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
      handlePrev();
    } else {
      handleNext();
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
      {/**
       * // [ ]: 퇴장시 opacity 적용 안되는 중. y축에 다른 backdropOpacity가 덮어쓰는 것 같음.
       */}
      <DimmedMotionDiv
        initial={isMobile ? { opacity: MIN_DIMMED_OPACITY } : {}}
        animate={isMobile ? { opacity: MAX_DIMMED_OPACITY } : {}}
        exit={isMobile ? { opacity: MIN_DIMMED_OPACITY } : {}}
        transition={{ duration: 0.2 }}
        style={{ opacity: backdropOpacity }}
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
        initial={isMobile ? { y: '100%' } : {}}
        animate={isMobile ? { y: 0 } : {}}
        exit={isMobile ? { y: '100%' } : {}}
        transition={{ duration: 0.2 }}
        sx={{
          position: 'relative',
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? '100%' : '95dvh',
          aspectRatio: isMobile ? 'auto' : '9/16',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'black',
          boxShadow: isMobile ? undefined : 3,
          touchAction: 'none',
        }}
        onClick={isMobile ? handleClickMobile : undefined}
      >
        <Box
          sx={{
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            borderRadius: isMobile ? 0 : 1,
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
          <IconButton onClick={handlePauseToggle} sx={{ color: 'white' }}>
            {paused ? <PlayArrow /> : <Pause />}
          </IconButton>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </Box>

        {!isMobile && (
          <>
            <IconButton onClick={handlePrev} sx={{ position: 'absolute', left: '-50px', zIndex: 10, color: 'white' }}>
              <ChevronLeft />
            </IconButton>

            <IconButton onClick={handleNext} sx={{ position: 'absolute', right: '-50px', zIndex: 10, color: 'white' }}>
              <ChevronRight />
            </IconButton>
          </>
        )}
      </ContentMotionDiv>
    </Box>
  );
};
