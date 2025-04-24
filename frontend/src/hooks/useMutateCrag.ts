import { useMutation, DefaultError, MutateOptions } from '@tanstack/react-query';

import { api } from '@/api/axios';

type ChangeCragNameMutateParmas = {
  cragId: string;
  name: string;
};

export function useMutateCragName({ onSettled }: MutateOptions<void, DefaultError, ChangeCragNameMutateParmas>) {
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

type ChangeCragDescriptionMutateParmas = {
  cragId: string;
  description: string;
};

export function useMutateCragDescription({
  onSettled,
}: MutateOptions<void, DefaultError, ChangeCragDescriptionMutateParmas>) {
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

export function useMutateCragArea({ onSettled }: MutateOptions<void, DefaultError, ChangeCragAreaMutateParmas>) {
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
