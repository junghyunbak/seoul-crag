import { api } from '@/api/axios';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useMutateLogout() {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    async mutationFn() {
      await api.post('/auth/logout');
    },
    onSuccess() {
      queryClient.removeQueries({ queryKey: ['me'] });
    },
  });

  return { logoutMutation };
}
