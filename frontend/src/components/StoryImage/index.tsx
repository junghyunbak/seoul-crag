import { useMemo } from 'react';

import { createPortal } from 'react-dom';

import { StringParam, useQueryParam } from 'use-query-params';

import { StorySlider } from '@/components/StorySlider';
import { ImageWithSource } from '@/components/ImageWithSource';

import { QUERY_STRING } from '@/constants';

import { useFetchCrag, useFetchImages } from '@/hooks';

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
      default:
        return QUERY_STRING.STORY_SHOWER;
    }
  }, [imageType]);

  const [cragId, setCragId] = useQueryParam(queryString, StringParam);

  const { crag } = useFetchCrag({ cragId });

  // TODO: crag 객체 내 imageType -> images가 된다면 필요없어질 fetch
  const { images } = useFetchImages(cragId, imageType);

  return createPortal(
    <AnimatePresence>
      {cragId && images && (
        <StorySlider
          crag={crag}
          contents={images.map((image) => (
            <ImageWithSource image={image} />
          ))}
          onClose={() => setCragId(null)}
          onComplete={() => setCragId(null)}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
