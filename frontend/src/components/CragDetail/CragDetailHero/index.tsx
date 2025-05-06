import { useState } from 'react';

import { Box, Stack } from '@mui/material';

import { ImageWithSource } from '@/components/ImageWithSource';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

interface CragDetailHeroProps {
  images: Image[] | null | undefined;
}

export function CragDetailHero({ images }: CragDetailHeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <Box sx={{ position: 'relative' }}>
      {images && images.length > 0 && (
        <Box ref={sliderRef} className="keen-slider" sx={{ height: 300 }}>
          {images.map((image, i) => (
            <ImageWithSource className="keen-slider__slide" key={i} image={image} />
          ))}
        </Box>
      )}
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
  );
}
