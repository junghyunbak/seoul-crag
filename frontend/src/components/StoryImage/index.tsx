import { useMemo } from 'react';

import { createPortal } from 'react-dom';

import { Box } from '@mui/material';

import { StringParam, useQueryParam } from 'use-query-params';

import { StorySlider } from '@/components/StorySlider';

import { QUERY_STRING } from '@/constants';

import { useFetchImages } from '@/hooks';

import { AnimatePresence } from 'framer-motion';

interface StoryImageProps {
  imageType: ImageType;
}

export default function StoryImage({ imageType }: StoryImageProps) {
  const queryString = useMemo(() => {
    switch (imageType) {
      case 'interior':
        return QUERY_STRING.STORY_INTERIOR;
      case 'shower':
        return QUERY_STRING.STORY_SHOWER;
    }
  }, [imageType]);

  const [cragId, setCragId] = useQueryParam(queryString, StringParam);

  const { images } = useFetchImages(cragId, imageType);

  return createPortal(
    <AnimatePresence>
      {cragId && images && (
        <StorySlider
          contents={images.map((image) => (
            <Box
              component="img"
              width="100%"
              src={image.url}
              sx={{
                userSelect: 'none',
                objectFit: 'cover',
              }}
            />
          ))}
          onClose={() => setCragId(null)}
          onComplete={() => setCragId(null)}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
