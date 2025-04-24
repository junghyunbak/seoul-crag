import { DefaultError, MutateOptions, useMutation } from '@tanstack/react-query';

import { api } from '@/api/axios';

type AddScheduleMutateParams = {
  cragId: string;
  date: string;
  type: ScheduleType;
  reason: string | null | undefined;
};

export function useMutateAddSchedule({ onSettled }: MutateOptions<void, DefaultError, AddScheduleMutateParams>) {
  const addScheduleMutation = useMutation<void, DefaultError, AddScheduleMutateParams>({
    mutationFn: async ({ cragId, date, type, reason }) => {
      await api.post(`/gyms/${cragId}/schedules`, {
        gymId: cragId,
        date,
        type,
        reason,
      });
    },
    onSettled,
  });

  return { addScheduleMutation };
}

type DeleteScheduleMutateParams = {
  cragId: string;
  scheduleId: string;
};

export function useMutateDeleteSchedule({ onSettled }: MutateOptions<void, DefaultError, DeleteScheduleMutateParams>) {
  const deleteScheduleMutation = useMutation<void, DefaultError, DeleteScheduleMutateParams>({
    mutationFn: async ({ cragId, scheduleId }) => {
      await api.delete(`/gyms/${cragId}/schedules/${scheduleId}`);
    },
    onSettled,
  });

  return { deleteScheduleMutation };
}

type UpdateScheduleMutateParams = {
  cragId: string;
  scheduleId: string;
  reason: string | null | undefined;
  type: ScheduleType;
};

export function useMutateUpdateSchedule({ onSettled }: MutateOptions<void, DefaultError, UpdateScheduleMutateParams>) {
  const updateScheduleMutation = useMutation<void, DefaultError, UpdateScheduleMutateParams>({
    mutationFn: async ({ cragId, scheduleId, reason, type }) => {
      await api.patch(`/gyms/${cragId}/schedules/${scheduleId}`, {
        type,
        reason,
      });
    },
    onSettled,
  });

  return {
    updateScheduleMutation,
  };
}
