import { useContext } from 'react';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { api } from '@/api/axios';

import { useQuery } from '@tanstack/react-query';

import { schedulesScheme } from '@/schemas/schedule';

import { GymScheduleCalendar } from '@/components/GymScheduleCalendar';

export function CragScheduleCalenderField() {
  const { crag } = useContext(cragFormContext);

  const { data, refetch } = useQuery({
    queryKey: ['schedules', crag.id],
    queryFn: async () => {
      const { data } = await api.get(`/gyms/${crag.id}/schedules`);

      const schedules = schedulesScheme.parse(data);

      return schedules;
    },
  });

  return (
    <GymScheduleCalendar
      schedules={data || []}
      onDelete={async (id) => {
        await api.delete(`/gyms/${crag.id}/schedules/${id}`);

        refetch();
      }}
      onUpdate={async ({ id, type, reason }) => {
        await api.patch(`/gyms/${crag.id}/schedules/${id}`, {
          type,
          reason,
        });

        refetch();
      }}
      onCreate={async ({ date, type, reason }) => {
        await api.post(`/gyms/${crag.id}/schedules`, {
          gymId: crag.id,
          date,
          type,
          reason,
        });

        refetch();
      }}
    />
  );
}
