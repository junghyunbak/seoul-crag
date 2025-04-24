import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { cragsScheme, cragScheme } from '@/schemas';

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
