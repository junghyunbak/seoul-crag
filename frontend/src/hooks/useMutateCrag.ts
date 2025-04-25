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

type ChangeCragOpeningHourMutateParams = {
  cragId: string;
  day: OpeningHourDayType;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

export function useMutateCragOpeningHour({
  onSettled,
}: MutateOptions<void, DefaultError, ChangeCragOpeningHourMutateParams>) {
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
}: MutateOptions<void, DefaultError, ChangeCragLocationMutateParams>) {
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

export function useMutateCreateCrag({ onSuccess }: MutateOptions<void, DefaultError, CreateCragMutateParams>) {
  const createCragMutation = useMutation<void, DefaultError, CreateCragMutateParams>({
    mutationFn: async (crag) => {
      await api.post('/gyms', crag);
    },
    onSuccess,
  });

  return {
    createCragMutation,
  };
}
