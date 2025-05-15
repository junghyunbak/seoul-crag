import React, { useEffect, useRef, useState } from 'react';

import { Avatar, Box, IconButton, Typography, useMediaQuery } from '@mui/material';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Pause from '@mui/icons-material/Pause';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Close from '@mui/icons-material/Close';
import { styled, useTheme } from '@mui/material/styles';

import { zIndex } from '@/styles';

import { motion, animate, useMotionValue } from 'framer-motion';

import { useDrag } from '@use-gesture/react';

import { QUERY_STRING, SIZE } from '@/constants';
import { StringParam, useQueryParam } from 'use-query-params';

const DimmedMotionDiv = styled(motion.div)``;
const ContentMotionDiv = styled(motion.div)``;

interface StorySliderProps {
  contents: React.ReactNode[];
  duration?: number;
  onComplete?: () => void;
  onClose?: () => void;
  initPaused?: boolean;
  crag?: Crag | null;
}

const BarContainer = styled(Box)({
  position: 'absolute',
  top: 8,
  left: 8,
  right: 8,
  height: 3,
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
  borderRadius: 2,
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
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
  crag,
}) => {
  const [index, setIndex] = useState({ value: 0 });
  const [paused, setPaused] = useState(initPaused);
  const y = useMotionValue(0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAGE_DETAIL, StringParam);

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

      if (memo === 'y') {
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

  const [longPressed, setLongPressed] = useState(false);
  const lastPaused = useRef(false);
  const longPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePointerDown = () => {
    lastPaused.current = paused;

    setPaused(true);
    setLongPressed(false);

    longPressTimeout.current = setTimeout(() => {
      setLongPressed(true);
    }, 600);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }

    setPaused(lastPaused.current);

    if (!longPressed) {
      const x = e.nativeEvent.offsetX;
      const width = (e.target as HTMLDivElement).clientWidth;

      if (x < width / 2) {
        goPrev();
      } else {
        goNext();
      }
    }
  };

  /**
   * https://github.com/pmndrs/use-gesture/issues/374
   *
   * use-gesture bind 함수를 spread 하여 사용할 때, 실제 동작에는 문제가 없지만
   *
   * motion.div와 이벤트 핸들러 타입이 맞지 않다고 에러가 발생하여 as any로 일단 처리함.
   */
  const gestureBind = bind() as any;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: zIndex.story,
        userSelect: 'none',
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
        {...gestureBind}
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
      >
        <Box
          sx={{ position: 'absolute', width: '100%', height: '100%' }}
          onPointerDownCapture={handlePointerDown}
          onPointerUpCapture={handlePointerUp}
        />

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

        <Box
          sx={{
            position: 'absolute',
            zIndex: 5,
            top: 0,

            background: 'linear-gradient(to bottom, #33333373, transparent)',

            width: '100%',
            p: 2,

            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
            }}
            onClick={() => {
              if (crag) {
                setPaused(true);
                setSelectCragId(crag.id);
              }
            }}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={crag?.thumbnail_url || ''}>
              {crag?.name}
            </Avatar>
            <Typography color="white">{crag?.name}</Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
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
        </Box>

        <TranslateBar index={index} count={contents.length} duration={duration} onNext={goNext} paused={paused} />

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
