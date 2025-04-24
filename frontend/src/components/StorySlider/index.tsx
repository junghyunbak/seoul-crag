import React, { useEffect, useRef, useState, TouchEvent, MouseEvent } from 'react';

import { Box, IconButton, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, Pause, PlayArrow, Close } from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';

import { zIndex } from '@/styles';

import { motion, animate, useMotionValue, useTransform } from 'framer-motion';

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
  const backdropOpacity = useTransform(y, [0, 400], [0.9, 0.3]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

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

  const handlePauseToggle = () => {
    setPaused((prev) => !prev);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY;

    const delta = currentY - touchStartY.current;

    if (delta > 0) {
      y.set(delta);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    const delta = y.get();

    if (delta > 100) {
      onClose?.();
    }

    animate(y, 0);
  };

  const handleClickMobile = (e: MouseEvent<HTMLDivElement>) => {
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
      <DimmedMotionDiv
        style={{
          opacity: backdropOpacity,
        }}
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'black',
          opacity: 0.9,
        }}
      />

      <ContentMotionDiv
        style={{
          y,
        }}
        initial={false}
        exit={{ y: '100%' }}
        transition={{ duration: 0.3 }}
        sx={{
          position: 'relative',
          width: isMobile ? '100%' : 'auto',
          height: isMobile ? '100%' : '95dvh',
          aspectRatio: isMobile ? 'auto' : '9/16',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'black',
          boxShadow: isMobile ? undefined : 3,
        }}
        onClick={isMobile ? handleClickMobile : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
          {contents[index.value]}
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
