import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { usersScheme } from '@/schemas/role';

export function useFetchUsers() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/users');

      const users = usersScheme.parse(data);

      return users;
    },
  });

  return {
    users,
  };
}

export function useFetchMe() {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const { data } = await api.get('/users/me');

      return data;
    },
  });

  return {
    user,
  };
}
