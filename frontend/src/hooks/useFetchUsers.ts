import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { userScheme, usersScheme } from '@/schemas';

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
  const { data: user, refetch } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const isPwa =
        window.matchMedia('(display-mode: standalone)').matches ||
        ('standalone' in window.navigator && window.navigator.standalone === true);

      /**
       * 로깅
       */
      await api.post('/visit', {
        url: window.location.href,
        is_pwa: isPwa,
      });

      const { data } = await api.get('/users/me');

      const user = userScheme.parse(data);

      return user;
    },
  });

  return {
    user,
    refetch,
  };
}
