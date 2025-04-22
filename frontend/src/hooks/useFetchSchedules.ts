import { useQuery } from '@tanstack/react-query';

import { schedulesScheme } from '@/schemas/schedule';

import { api } from '@/api/axios';

export function useFetchSchedules(cragId: string | null | undefined) {
  const { data: schedules, refetch } = useQuery({
    queryKey: ['schedules', cragId],
    queryFn: async () => {
      if (!cragId) {
        return [];
      }

      const { data } = await api.get(`/gyms/${cragId}/schedules`);

      const schedules = schedulesScheme.parse(data);

      return schedules;
    },
  });

  return { schedules, refetch };
}
