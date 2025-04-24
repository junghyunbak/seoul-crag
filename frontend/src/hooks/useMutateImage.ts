import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query';

import { api } from '@/api/axios';

type AddImageMutateParams = {
  form: FormData;
  cragId: string;
};

export function useMutateImageAdd({ onSettled }: MutationOptions<void, DefaultError, AddImageMutateParams>) {
  const addImageMutation = useMutation<void, DefaultError, AddImageMutateParams>({
    mutationFn: async ({ form, cragId }) => {
      await api.post(`/gym-images/${cragId}/images`, form);
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
  nextItems: (File | Image)[];
};

export function useMutateImageReorder({ onSettled }: MutationOptions<void, DefaultError, ReorderImageMutateParams>) {
  const reorderImageMutation = useMutation<void, DefaultError, ReorderImageMutateParams>({
    mutationFn: async ({ cragId, imageType, nextItems }) => {
      await api.post(`/gym-images/${cragId}/images/reorder`, {
        type: imageType,
        orderedIds: nextItems.filter((image) => 'id' in image).map((image) => image.id),
      });
    },
    onSettled,
  });

  return { reorderImageMutation };
}
