import { useQuery } from '@tanstack/react-query';
import { contributionsScheme } from '@/schemas/contribute';
import { api } from '@/api/axios';

export function useFetchContributes() {
  const { data: contributions, refetch } = useQuery({
    queryKey: ['contributions'],
    queryFn: async () => {
      const { data } = await api.get('/contribution');

      const contributions = contributionsScheme.parse(data);

      return contributions;
    },
  });

  return { contributions, refetch };
}
