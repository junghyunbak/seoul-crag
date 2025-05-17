import { api } from '@/api/axios';
import { useQuery } from '@tanstack/react-query';
import { NoticesScheme } from '@/schemas/notice';

export const useFetchNotices = (visible = false) => {
  const { data: notices, refetch } = useQuery({
    queryKey: ['notices', visible],
    queryFn: async () => {
      const { data } = await api.get(`/notices${visible ? '?visible=true' : ''}`);

      const notices = NoticesScheme.parse(data);

      return notices;
    },
  });

  return { notices, refetch };
};
