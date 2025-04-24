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

const ProgressBar = React.memo(
  ({
    count,
    activeIndex,
    duration,
    onNext,
    paused,
  }: {
    count: number;
    activeIndex: number;
    duration: number;
    onNext: () => void;
    paused: boolean;
  }) => {
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (activeIndex >= count || paused) return;
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(0);

      const start = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / duration) * 100, 100);
        setProgress(percent);
        if (percent === 100) {
          clearInterval(intervalRef.current!);
          onNext();
        }
      }, 16);

      return () => clearInterval(intervalRef.current!);
    }, [activeIndex, duration, count, onNext, paused]);

    return (
      <Box position="absolute" top={8} left={8} right={8} display="flex" gap={0.5} zIndex={5}>
        {Array.from({ length: count }).map((_, i) => (
          <Box key={i} flex={1} height={4} borderRadius={4} bgcolor="rgba(255,255,255,0.3)" overflow="hidden">
            <Box
              height="100%"
              bgcolor="white"
              style={{
                transform: `scaleX(${i < activeIndex ? 1 : i === activeIndex ? progress / 100 : 0})`,
                transformOrigin: 'left',
                transition: i === activeIndex ? 'transform 0.1s linear' : undefined,
              }}
            />
          </Box>
        ))}
      </Box>
    );
  }
);

export const StorySlider: React.FC<StorySliderProps> = ({
  contents,
  duration = 5000,
  onComplete,
  onClose,
  initPaused = false,
}) => {
  const [index, setIndex] = useState({ value: 0 });
  const [paused, setPaused] = useState(initPaused);
  const y = useMotionValue(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const goPrev = () => {
    if (index.value >= 0) {
      setIndex({ value: Math.max(index.value - 1, 0) });
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
      if (!memo) {
        memo = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
      }
      if (memo === 'x') {
        if (last) {
          if (mx > SIZE.SWIPE_THRESHOLD_X) goPrev();
          else if (mx < -SIZE.SWIPE_THRESHOLD_X) goNext();
        }
      } else if (memo === 'y') {
        const nextY = Math.max(my, 0);
        y.set(nextY);
        if (last) {
          if (nextY > SIZE.CLOSE_THRESHOLD_Y || vy > 1.5) onClose?.();
          else animate(y, 0);
        }
      }
      return memo;
    },
    { axis: 'lock', filterTaps: true, pointer: { touch: true } }
  );

  const handleClickMobile = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const width = (e.target as HTMLDivElement).clientWidth;
    if (x < width / 2) goPrev();
    else goNext();
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
        sx={{ position: 'absolute', inset: 0, backgroundColor: 'black' }}
        onClick={onClose}
      />

      <ContentMotionDiv
        {...bind()}
        style={{
          y,
          width: isMobile ? '100%' : undefined,
          height: isMobile ? '100%' : '95dvh',
          aspectRatio: isMobile ? 'auto' : '9 / 16',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.2 }}
        sx={{
          position: 'relative',
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
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
          {contents[index.value]}
        </Box>

        <ProgressBar
          count={contents.length}
          activeIndex={index.value}
          duration={duration}
          onNext={goNext}
          paused={paused}
        />

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
