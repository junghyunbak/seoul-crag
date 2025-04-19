import { api } from '@/api/axios';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useMutateGrantRole({ userId, onSuccess = () => {} }: { userId: string; onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const grantMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => {
      return api.post(`/admin/users/${userId}/roles/${roleId}`);
    },
    onSuccess: () => {
      onSuccess();

      queryClient.invalidateQueries({ queryKey: ['userRoles', userId] });
    },
  });

  return { grantMutation };
}

export function useMutateRevokeRole({ userId, onSuccess = () => {} }: { userId: string; onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const revokeMutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) => {
      return api.delete(`/admin/users/${userId}/roles/${roleId}`);
    },
    onSuccess: () => {
      onSuccess();

      queryClient.invalidateQueries({ queryKey: ['userRoles', userId] });
    },
  });

  return {
    revokeMutation,
  };
}
