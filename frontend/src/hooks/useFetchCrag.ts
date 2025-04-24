import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { cragsScheme, cragScheme, openingHoursScheme } from '@/schemas';

export function useFetchCrags() {
  const { data: crags } = useQuery({
    queryKey: ['crags'],
    queryFn: async () => {
      const { data } = await api.get('/gyms');

      const crags = cragsScheme.parse(data);

      return crags;
    },
  });

  return { crags };
}

export function useFetchCrag({
  cragId,
  enabled = true,
  initialData,
}: {
  cragId: string | undefined | null;
  enabled?: boolean;
  initialData?: Crag;
}) {
  const { data: crag, refetch } = useQuery({
    queryKey: ['crag', cragId],
    queryFn: async () => {
      if (!cragId) {
        return null;
      }

      const { data } = await api.get(`/gyms/${cragId}`);

      const crag = cragScheme.parse(data);

      return crag;
    },
    enabled,
    initialData,
  });

  return { crag, refetch };
}

export function useFetchOpeningHours(cragId: string) {
  const { data: openingHours } = useQuery({
    queryKey: ['openingHours', cragId],
    queryFn: async () => {
      const { data } = await api.get(`/gyms/${cragId}/opening-hours`);

      const openingHours = openingHoursScheme.parse(data);

      return openingHours;
    },
  });

  return { openingHours };
}
