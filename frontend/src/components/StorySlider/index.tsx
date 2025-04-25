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

const BarContainer = styled(Box)({
  position: 'absolute',
  top: 8,
  left: 8,
  right: 8,
  height: 4,
  overflow: 'hidden',
  display: 'flex',
  gap: 4,
  zIndex: 5,
});

const Segment = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'complete',
})<{ complete?: boolean }>(({ complete }) => ({
  flex: 1,
  height: '100%',
  backgroundColor: complete ? '#fff' : 'rgba(255,255,255,0.2)',
  borderRadius: 4,
  position: 'relative',
  overflow: 'hidden',
}));

const Thumb = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  height: '100%',
  backgroundColor: '#fff',
  transformOrigin: 'left',
});

const TranslateBar = React.memo(
  ({
    index,
    count,
    duration,
    onNext,
    paused,
  }: {
    index: { value: number };
    count: number;
    duration: number;
    onNext: () => void;
    paused: boolean;
  }) => {
    const [progress, setProgress] = useState(0);
    const requestRef = useRef<number | null>(null);
    const elapsedRef = useRef(0);
    const prevIndexRef = useRef(index);

    useEffect(() => {
      if (index !== prevIndexRef.current) {
        elapsedRef.current = 0;
        setProgress(0);
        prevIndexRef.current = index;
      }
    }, [index]);

    useEffect(() => {
      if (index.value >= count) return;

      if (paused) {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        return;
      }

      const start = performance.now() - elapsedRef.current;

      const update = (now: number) => {
        const elapsed = now - start;
        const percent = Math.min(elapsed / duration, 1);
        elapsedRef.current = elapsed;

        if (percent >= 1) {
          setProgress(0);
          elapsedRef.current = 0;
          onNext();
          return;
        }

        setProgress(percent);
        requestRef.current = requestAnimationFrame(update);
      };

      requestRef.current = requestAnimationFrame(update);

      return () => {
        if (requestRef.current !== null) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }, [index, count, duration, onNext, paused]);

    return (
      <BarContainer>
        {Array.from({ length: count }).map((_, i) => (
          <Segment key={i} complete={i < index.value}>
            {i === index.value && progress < 1 && (
              <Thumb
                style={{
                  width: '100%',
                  transform: `translateX(${(progress - 1) * 100}%)`,
                }}
              />
            )}
          </Segment>
        ))}
      </BarContainer>
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
    setIndex((prev) => ({ value: Math.max(0, prev.value - 1) }));
  };

  const goNext = () => {
    setIndex((prev) => ({ value: prev.value + 1 }));
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
          {contents[Math.min(index.value, contents.length - 1)]}
        </Box>

        <TranslateBar index={index} count={contents.length} duration={duration} onNext={goNext} paused={paused} />

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
