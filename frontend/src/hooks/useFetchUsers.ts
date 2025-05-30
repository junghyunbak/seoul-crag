import { useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { z } from 'zod';

import { userSchema } from '@/schemas';

export function useFetchUsers() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/v2/users');

      const users = z.array(userSchema).parse(data);

      return users;
    },
  });

  return {
    users,
  };
}

export function useFetchUser(userId: string | null) {
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) {
        return undefined;
      }

      const { data } = await api.get(`/v2/users/${userId}`);

      const user = userSchema.parse(data);

      return user;
    },
  });

  return { user };
}

export function useFetchMe() {
  const {
    data: user,
    refetch,
    isLoading,
  } = useQuery({
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

      const { data } = await api.get('/v2/users/me');

      const user = userSchema.parse(data);

      return user;
    },
  });

  return {
    user,
    refetch,
    isLoading,
  };
}
