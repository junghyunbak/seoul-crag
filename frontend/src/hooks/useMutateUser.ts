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

type UpdateUserNicknameMutateParams = {
  nickname: string;
};

export function useMutateUserNickname({
  onSettled,
}: MutationOptions<void, DefaultError, UpdateUserNicknameMutateParams>) {
  const updateUserNicknameMutation = useMutation<void, DefaultError, UpdateUserNicknameMutateParams>({
    mutationFn: async ({ nickname }) => {
      await api.patch(`/users`, {
        username: nickname,
      });
    },
    onSettled,
  });

  return { updateUserNicknameMutation };
}

type UpdateUserEmailMutateParams = {
  email: string;
};

export function useMutateUserEmail({ onSettled }: MutationOptions<void, DefaultError, UpdateUserEmailMutateParams>) {
  const updateUserEmailMutation = useMutation<void, DefaultError, UpdateUserEmailMutateParams>({
    mutationFn: async ({ email }) => {
      await api.patch(`/users`, {
        email,
      });
    },
    onSettled,
  });

  return { updateUserEmailMutation };
}
