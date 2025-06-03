import { useEffect, useMemo } from 'react';

import { createPortal } from 'react-dom';

import { StringParam, useQueryParam } from 'use-query-params';

import { Molecules } from '@/components/molecules';

import { QUERY_STRING } from '@/constants';

import { useFetchCrag } from '@/hooks';

import { AnimatePresence } from 'framer-motion';

export function ImageStory({ imageType }: { imageType: ImageType }) {
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

  const images = (crag?.images || []).filter((image) => image.type === imageType);

  /**
   * preload images
   */
  useEffect(() => {
    (images || []).forEach((image) => {
      const img = new Image();
      img.src = image.url;
    });
  }, [images]);

  return createPortal(
    <AnimatePresence>
      {cragId && images && (
        <Molecules.Story
          crag={crag}
          contents={images
            .sort((a, b) => (a.order < b.order ? -1 : 1))
            .map((image) => (
              <Molecules.ImageWithSource image={image} />
            ))}
          onClose={() => setCragId(null)}
          onComplete={() => setCragId(null)}
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
