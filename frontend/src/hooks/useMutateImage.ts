import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query';

import { api } from '@/api/axios';

type UploadImageMutateParams = {
  form: FormData;
};

export function useMutateUploadImage({ onSettled }: MutationOptions<string, DefaultError, UploadImageMutateParams>) {
  const uploadImageMutation = useMutation<string, DefaultError, UploadImageMutateParams>({
    mutationFn: async ({ form }) => {
      const { data } = await api.post(`/image`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    },
    onSettled,
  });

  return { uploadImageMutation };
}

type AddImageMutateParams = {
  form: FormData;
  cragId: string;
};

export function useMutateImageAdd({ onSettled }: MutationOptions<void, DefaultError, AddImageMutateParams>) {
  const addImageMutation = useMutation<void, DefaultError, AddImageMutateParams>({
    mutationFn: async ({ form, cragId }) => {
      await api.post(`/gym-images/${cragId}/images`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSettled,
  });

  return { addImageMutation };
}

type DeleteImageMutateParams = {
  cragId: string;
  imageId: string;
};

export function useMutateImageDelete({ onSettled }: MutationOptions<void, DefaultError, DeleteImageMutateParams>) {
  const deleteImageMutation = useMutation({
    mutationFn: async ({ cragId, imageId }) => {
      await api.delete(`/gym-images/${cragId}/images/${imageId}`);
    },
    onSettled,
  });

  return {
    deleteImageMutation,
  };
}

type ReorderImageMutateParams = {
  imageType: ImageType;
  cragId: string;
  images: Image[];
};

export function useMutateImageReorder({ onSettled }: MutationOptions<void, DefaultError, ReorderImageMutateParams>) {
  const reorderImageMutation = useMutation<void, DefaultError, ReorderImageMutateParams>({
    mutationFn: async ({ cragId, imageType, images }) => {
      await api.post(`/gym-images/${cragId}/images/reorder`, {
        type: imageType,
        orderedIds: images.map((image) => image.id),
      });
    },
    onSettled,
  });

  return { reorderImageMutation };
}

type UpdateImageMutateParams = {
  cragId: string;
  imageId: string;
  source: string;
};

export function useMutateImageUpdate({ onSettled }: MutationOptions<void, DefaultError, UpdateImageMutateParams>) {
  const updateImageMutation = useMutation<void, DefaultError, UpdateImageMutateParams>({
    mutationFn: async ({ imageId, cragId, source }) => {
      await api.patch(`/gym-images/${cragId}/images`, {
        imageId,
        source,
      });
    },
    onSettled,
  });

  return { updateImageMutation };
}
