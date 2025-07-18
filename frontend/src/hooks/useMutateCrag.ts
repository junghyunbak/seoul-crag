import { useMutation, DefaultError, MutationOptions } from '@tanstack/react-query';

import { api } from '@/api/axios';
import { z } from 'zod';
import { InternalCragSchema } from '@/schemas';

export function useMutationCrag() {
  const patchCragMutation = useMutation<
    void,
    DefaultError,
    Pick<z.infer<typeof InternalCragSchema>, 'id'> &
      Partial<MyOmit<z.infer<typeof InternalCragSchema>, 'created_at' | 'updated_at' | 'id'>>
  >({
    mutationFn: async (crag) => {
      const { id, ...other } = crag;

      await api.patch(`/gyms/${id}`, {
        ...other,
      });
    },
  });

  return { patchCragMutation };
}

// useMutationCrag 훅 사용으로 대체 (삭제)
export function useMutateCragOuterWall() {
  const changeCragOuterWallMutation = useMutation<void, DefaultError, { cragId: string; isOuterWall: boolean }>({
    mutationFn: async ({ cragId, isOuterWall }) => {
      await api.patch(`/gyms/${cragId}`, {
        is_outer_wall: isOuterWall,
      });
    },
  });

  return { changeCragOuterWallMutation };
}

export function useMutateCragShowerUrl() {
  const changeCragShowerUrlMutation = useMutation<void, DefaultError, { cragId: string; showerUrl: string }>({
    mutationFn: async ({ cragId, showerUrl }) => {
      await api.patch(`/gyms/${cragId}`, {
        shower_url: showerUrl,
      });
    },
  });

  return {
    changeCragShowerUrlMutation,
  };
}

type ChangeCragNameMutateParmas = {
  cragId: string;
  name: string;
};

export function useMutateCragName({ onSettled }: MutationOptions<void, DefaultError, ChangeCragNameMutateParmas>) {
  const changeCragNameMutation = useMutation<void, DefaultError, ChangeCragNameMutateParmas>({
    mutationFn: async ({ cragId, name }) => {
      await api.patch(`/gyms/${cragId}`, {
        name,
      });
    },
    onSettled,
  });

  return { changeCragNameMutation };
}

type ChangeCragShortNameMutateParmas = {
  cragId: string;
  name: string;
};

export function useMutateCragShortName({
  onSettled,
}: MutationOptions<void, DefaultError, ChangeCragShortNameMutateParmas>) {
  const changeCragShortNameMutation = useMutation<void, DefaultError, ChangeCragShortNameMutateParmas>({
    mutationFn: async ({ cragId, name }) => {
      await api.patch(`/gyms/${cragId}`, {
        short_name: name,
      });
    },
    onSettled,
  });

  return { changeCragShortNameMutation };
}

type ChangeCragWebsitUrlMutateParams = {
  cragId: string;
  websiteUrl: string;
};

export function useMutateCragWebsiteUrl({
  onSettled,
}: MutationOptions<void, DefaultError, ChangeCragWebsitUrlMutateParams>) {
  const changeCragWebsiteUrlMutation = useMutation<void, DefaultError, ChangeCragWebsitUrlMutateParams>({
    mutationFn: async ({ cragId, websiteUrl }) => {
      await api.patch(`/gyms/${cragId}`, {
        website_url: websiteUrl,
      });
    },
    onSettled,
  });

  return { changeCragWebsiteUrlMutation };
}

type ChangeCragDescriptionMutateParmas = {
  cragId: string;
  description: string;
};

export function useMutateCragDescription({
  onSettled,
}: MutationOptions<void, DefaultError, ChangeCragDescriptionMutateParmas>) {
  const changeCragDescriptionMutation = useMutation<void, DefaultError, ChangeCragDescriptionMutateParmas>({
    mutationFn: async ({ cragId, description }) => {
      await api.patch(`/gyms/${cragId}`, {
        description,
      });
    },
    onSettled,
  });

  return {
    changeCragDescriptionMutation,
  };
}

type ChangeCragAreaMutateParmas = {
  cragId: string;
  area: number;
};

export function useMutateCragArea({ onSettled }: MutationOptions<void, DefaultError, ChangeCragAreaMutateParmas>) {
  const changeCragAreaMutation = useMutation<void, DefaultError, ChangeCragAreaMutateParmas>({
    mutationFn: async ({ area, cragId }) => {
      await api.patch(`/gyms/${cragId}`, {
        area,
      });
    },
    onSettled,
  });

  return {
    changeCragAreaMutation,
  };
}

type ChangeCragOpeningHourMutateParams = {
  cragId: string;
  day: OpeningHourDayType;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export function useMutateCragOpeningHour({
  onSettled,
}: MutationOptions<void, DefaultError, ChangeCragOpeningHourMutateParams>) {
  const changeCragOpeningHourMutation = useMutation<void, DefaultError, ChangeCragOpeningHourMutateParams>({
    mutationFn: async ({ cragId, day, openTime, closeTime, isClosed }) => {
      await api.patch(`/gyms/${cragId}/opening-hours`, {
        day,
        open_time: openTime,
        close_time: closeTime,
        is_closed: isClosed,
      });
    },
    onSettled,
  });

  return { changeCragOpeningHourMutation };
}

type ChangeCragLocationMutateParams = {
  cragId: string;
  latitude: number;
  longitude: number;
};

export function useMutateCragLocation({
  onSettled,
}: MutationOptions<void, DefaultError, ChangeCragLocationMutateParams>) {
  const changeCragLocationMutation = useMutation<void, DefaultError, ChangeCragLocationMutateParams>({
    mutationFn: async ({ cragId, latitude, longitude }) => {
      await api.patch(`/gyms/${cragId}`, {
        latitude,
        longitude,
      });
    },
    onSettled,
  });

  return { changeCragLocationMutation };
}

type CreateCragMutateParams = Pick<Crag, 'name' | 'description' | 'latitude' | 'longitude'>;

export function useMutateCreateCrag({ onSuccess }: MutationOptions<void, DefaultError, CreateCragMutateParams>) {
  const createCragMutation = useMutation<void, DefaultError, CreateCragMutateParams>({
    mutationFn: async (crag) => {
      const { data } = await api.post('/gyms', crag);

      return data;
    },
    onSuccess,
  });

  return {
    createCragMutation,
  };
}

type CragImageAddMutateParams = {
  cragId: string;
  url: string;
  source: string;
  type: ImageType;
};

export function useMutateCragImageAdd({ onSettled }: MutationOptions<void, DefaultError, CragImageAddMutateParams>) {
  const cragImageAddMutation = useMutation<void, DefaultError, CragImageAddMutateParams>({
    mutationFn: async ({ cragId, url, source, type }) => {
      await api.post(`/gym-images/${cragId}/images`, {
        url,
        source,
        type,
      });
    },
    onSettled,
  });

  return { cragImageAddMutation };
}

type CragImageUpdateMutateParams = {
  cragId: string;
  imageId: string;
  source: string;
};

export function useMutateCragImageUpdate({
  onSettled,
}: MutationOptions<void, DefaultError, CragImageUpdateMutateParams>) {
  const cragImageUpdateMutation = useMutation<void, DefaultError, CragImageUpdateMutateParams>({
    mutationFn: async ({ imageId, cragId, source }) => {
      await api.patch(`/gym-images/${cragId}/images`, {
        imageId,
        source,
      });
    },
    onSettled,
  });

  return { cragImageUpdateMutation };
}

type CragImageDeleteMutateParams = {
  cragId: string;
  imageId: string;
};

export function useMutateCragImageDelete({
  onSettled,
}: MutationOptions<void, DefaultError, CragImageDeleteMutateParams>) {
  const cragImageDeleteMutation = useMutation<void, DefaultError, CragImageDeleteMutateParams>({
    mutationFn: async ({ cragId, imageId }) => {
      await api.delete(`/gym-images/${cragId}/images/${imageId}`);
    },
    onSettled,
  });

  return {
    cragImageDeleteMutation,
  };
}

type CragImageReorderMutateParams = {
  imageType: ImageType;
  cragId: string;
  images: Image[];
};

export function useMutateCragImageReorder({
  onSettled,
}: MutationOptions<void, DefaultError, CragImageReorderMutateParams>) {
  const cragImageReorderMutation = useMutation<void, DefaultError, CragImageReorderMutateParams>({
    mutationFn: async ({ cragId, imageType, images }) => {
      await api.post(`/gym-images/${cragId}/images/reorder`, {
        type: imageType,
        orderedIds: images.map((image) => image.id),
      });
    },
    onSettled,
  });

  return { cragImageReorderMutation };
}

type CragThumbnailUpdateMutateParams = {
  cragId: string;
  url: string;
};

export function useMutateCragThumbnailUpdate({
  onSettled,
}: MutationOptions<void, DefaultError, CragThumbnailUpdateMutateParams>) {
  const cragThumbnailUpdateMutation = useMutation<void, DefaultError, CragThumbnailUpdateMutateParams>({
    mutationFn: async ({ cragId, url }) => {
      await api.patch(`/gyms/${cragId}`, {
        thumbnail_url: url,
      });
    },
    onSettled,
  });

  return { cragThumbnailUpdateMutation };
}

type CragOpenedAtUpdateMutateParams = {
  cragId: string;
  openedAt: string | null;
};

export function useMutateCragOpenedAtUpdate({
  onSettled,
}: MutationOptions<void, DefaultError, CragOpenedAtUpdateMutateParams>) {
  const cragOpenedAtUpdateMutation = useMutation<void, DefaultError, CragOpenedAtUpdateMutateParams>({
    mutationFn: async ({ cragId, openedAt }) => {
      await api.patch(`/gyms/${cragId}`, {
        opened_at: openedAt,
      });
    },
    onSettled,
  });

  return { cragOpenedAtUpdateMutation };
}
