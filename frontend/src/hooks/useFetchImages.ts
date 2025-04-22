import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { imagesScheme } from '@/schemas/image';

export function useFetchImages(cragId: string | null | undefined, imageType: ImageType) {
  const { data: images, refetch } = useQuery({
    queryKey: ['images', imageType, cragId],
    queryFn: async () => {
      if (!cragId) {
        return null;
      }

      const { data } = await api.get(`/gym-images/${cragId}/images/${imageType}`);

      const images = imagesScheme.parse(data);

      images.sort((a, b) => (a.order < b.order ? -1 : 1));

      return images;
    },
  });

  return { images, refetch };
}
