import { useMemo } from 'react';

import { createPortal } from 'react-dom';

import { Box } from '@mui/material';

import { StringParam, useQueryParam } from 'use-query-params';

import { StorySlider } from '@/components/StorySlider';

import { QUERY_STRING } from '@/constants';

import { useFetchImages } from '@/hooks';

interface ImageStoryProps {
  imageType: ImageType;
}

export function ImageStory({ imageType }: ImageStoryProps) {
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
    <div>
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
    </div>,
    document.body
  );
}
