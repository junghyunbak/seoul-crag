import { useQuery } from '@tanstack/react-query';

import { rolesScheme } from '@/schemas';

import { api } from '@/api/axios';

export function useFetchAllRoles() {
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data } = await api.get('/roles');

      const roles = rolesScheme.parse(data);

      return roles;
    },
  });

  return { roles };
}

export function useFetchUserRoles({
  userId,
  enabled = false,
  initialData,
}: {
  userId: string;
  enabled?: boolean;
  initialData: Role[];
}) {
  const { data: userRoles } = useQuery({
    queryKey: ['userRoles', userId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/users/${userId}/roles`);

      const roles = rolesScheme.parse(data);

      return roles;
    },
    enabled,
    initialData,
  });

  return { userRoles };
}
