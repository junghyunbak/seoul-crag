import React, { useEffect, useRef, useState, TouchEvent, MouseEvent } from 'react';

import { Box, IconButton, useMediaQuery } from '@mui/material';
import { ChevronLeft, ChevronRight, Pause, PlayArrow, Close } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { zIndex } from '@/styles';

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
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(initPaused);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const resetTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
  };

  useEffect(() => {
    if (paused || index >= contents.length) return;

    resetTimers();
    const start = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.min((elapsed / duration) * 100, 100);
      setProgress(percent);
    }, 16);

    timeoutRef.current = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, duration);

    return resetTimers;
  }, [index, duration, contents, paused]);

  useEffect(() => {
    if (index === contents.length) {
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

  const handlePrev = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleNext = () => {
    setIndex(index + 1);
  };

  const handlePauseToggle = () => {
    setPaused((prev) => !prev);
  };

  const touchStartX = useRef(0);
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
  };

  const handleClickMobile = (e: MouseEvent<HTMLDivElement>) => {
    const x = e.nativeEvent.offsetX;
    const width = (e.target as HTMLDivElement).clientWidth;
    if (x < width / 2) handlePrev();
    else handleNext();
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bgcolor={isMobile ? 'black' : 'rgba(0,0,0,0.9)'}
      display="flex"
      justifyContent="center"
      alignItems="center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      zIndex={zIndex.story}
    >
      <Box
        position="relative"
        width={isMobile ? '100%' : 'auto'}
        height={isMobile ? '100%' : '95dvh'}
        sx={{
          aspectRatio: isMobile ? 'auto' : '9/16',
          display: 'flex',
          alignItems: 'center',
        }}
        borderRadius={isMobile ? 0 : 1}
        bgcolor="black"
        boxShadow={isMobile ? undefined : 3}
        onClick={isMobile ? handleClickMobile : undefined}
      >
        <Box
          sx={{
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
          borderRadius={1}
        >
          {contents[index]}
        </Box>

        {/* 상단 진행 바 */}
        <Box position="absolute" top={8} left={8} right={8} display="flex" gap={0.5} zIndex={5}>
          {contents.map((_, i) => (
            <Box key={i} flex={1} height={4} borderRadius={4} bgcolor="rgba(255,255,255,0.3)" overflow="hidden">
              <Box
                height="100%"
                bgcolor="white"
                sx={{
                  width: i < index ? '100%' : i === index ? `${progress}%` : '0%',
                  transition: i === index ? 'width 0.1s linear' : 'none',
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
      </Box>
    </Box>
  );
};
