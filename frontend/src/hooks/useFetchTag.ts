import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { TagsScheme } from '@/schemas/tag';

export function useFetchTags() {
  const { data: tags, refetch } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await api.get('/tags');

      const tags = TagsScheme.parse(data);

      return tags;
    },
  });

  return { tags, refetch };
}
