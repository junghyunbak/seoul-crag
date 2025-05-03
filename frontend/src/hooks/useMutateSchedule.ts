import { DefaultError, MutateOptions, useMutation } from '@tanstack/react-query';

import { api } from '@/api/axios';

type AddScheduleMutateParams = {
  cragId: string;
  type: ScheduleType;
  openDate: Schedule['open_date'];
  closeDate: Schedule['close_date'];
};

export function useMutateAddSchedule({ onSettled }: MutateOptions<void, DefaultError, AddScheduleMutateParams>) {
  const addScheduleMutation = useMutation<void, DefaultError, AddScheduleMutateParams>({
    mutationFn: async ({ cragId, openDate, closeDate, type }) => {
      await api.post(`/gyms/${cragId}/schedules`, {
        gymId: cragId,
        type,
        open_date: openDate,
        close_date: closeDate,
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
  type: ScheduleType;
  openDate: Schedule['open_date'];
  closeDate: Schedule['close_date'];
};

export function useMutateUpdateSchedule({ onSettled }: MutateOptions<void, DefaultError, UpdateScheduleMutateParams>) {
  const updateScheduleMutation = useMutation<void, DefaultError, UpdateScheduleMutateParams>({
    mutationFn: async ({ cragId, scheduleId, openDate, closeDate, type }) => {
      await api.patch(`/gyms/${cragId}/schedules/${scheduleId}`, {
        type,
        open_date: openDate,
        close_date: closeDate,
      });
    },
    onSettled,
  });

  return {
    updateScheduleMutation,
  };
}
