import { createPortal } from 'react-dom';

import { StringParam, useQueryParam } from 'use-query-params';

import { StorySlider } from '@/components/StorySlider';

import { QUERY_STRING } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { imagesScheme } from '@/schemas/image';
import { useMemo } from 'react';

interface StoryPortalProps {
  imageType: ImageType;
}

export function StoryPortal({ imageType }: StoryPortalProps) {
  const queryString = useMemo(() => {
    switch (imageType) {
      case 'interior':
        return QUERY_STRING.STORY_INTERIOR;
      case 'thumbnail':
        return 'test';
    }
  }, [imageType]);

  const [cragId, setCragId] = useQueryParam(queryString, StringParam);

  const { data: images } = useQuery({
    queryKey: ['images', imageType, cragId],
    queryFn: async () => {
      if (!cragId) {
        return null;
      }

      const { data } = await api.get(`/gym-images/${cragId}/images/${imageType}`);

      const images = imagesScheme.parse(data);

      return images;
    },
  });

  return createPortal(
    <div>
      {images && (
        <StorySlider
          images={images.map((image) => image.url)}
          onClose={() => setCragId(null)}
          onComplete={() => setCragId(null)}
        />
      )}
    </div>,
    document.body
  );
}
