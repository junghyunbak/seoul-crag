import { useContext, useState } from 'react';

import { Box, Skeleton, Stack, useTheme } from '@mui/material';

import { CragDetailContext } from '../index.context';

import { Molecules } from '@/components/molecules';

import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

export function CragDetailHero() {
  const { crag } = useContext(CragDetailContext);
  const [currentSlide, setCurrentSlide] = useState(0);

  const theme = useTheme();

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: 'snap',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  if (!crag) {
    return <Skeleton variant="rectangular" width={'100%'} height={'300px'} />;
  }

  const images = crag.images.filter((image) => image.type === 'interior');

  return (
    <Box sx={{ position: 'relative' }}>
      {images && images.length > 0 && (
        <Box ref={sliderRef} className="keen-slider" sx={{ height: 300 }}>
          {images.map((image, i) => (
            <Molecules.ImageWithSource className="keen-slider__slide" key={i} image={image} />
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
                bgcolor: currentSlide === i ? theme.palette.primary.main : theme.palette.grey[400],
                transition: 'all 0.3s',
              }}
            />
          ))}
      </Stack>
    </Box>
  );
}
