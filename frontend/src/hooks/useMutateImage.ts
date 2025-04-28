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
