import { api } from '@/api/axios';
import { DefaultError, MutationOptions, useMutation } from '@tanstack/react-query';

type UpdateUserImageMutateParams = {
  url: string;
};

export function useMutateUserImage({ onSettled }: MutationOptions<void, DefaultError, UpdateUserImageMutateParams>) {
  const updateUserImageMutation = useMutation<void, DefaultError, UpdateUserImageMutateParams>({
    mutationFn: async ({ url }) => {
      await api.patch(`/users`, {
        profile_image: url,
      });
    },
    onSettled,
  });

  return { updateUserImageMutation };
}
