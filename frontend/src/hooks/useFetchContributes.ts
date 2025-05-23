import { useQuery } from '@tanstack/react-query';
import { contributionsSchema } from '@/schemas/contribute';
import { api } from '@/api/axios';

export function useFetchContributes() {
  const { data: contributions, refetch } = useQuery({
    queryKey: ['contributions'],
    queryFn: async () => {
      const { data } = await api.get('/contribution');

      const contributions = contributionsSchema.parse(data);

      return contributions;
    },
  });

  return { contributions, refetch };
}
