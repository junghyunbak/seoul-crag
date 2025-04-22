import { useContext } from 'react';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { api } from '@/api/axios';

import { ScheduleCalendar } from '@/components/ScheduleCalendar';

import { useFetchSchedules } from '@/hooks';

export function CragScheduleCalenderField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { schedules, refetch } = useFetchSchedules(crag.id);

  return (
    <ScheduleCalendar
      schedules={schedules || []}
      onDelete={async (id) => {
        await api.delete(`/gyms/${crag.id}/schedules/${id}`);

        refetch();
        revalidateCrag();
      }}
      onUpdate={async ({ id, type, reason }) => {
        await api.patch(`/gyms/${crag.id}/schedules/${id}`, {
          type,
          reason,
        });

        refetch();
        revalidateCrag();
      }}
      onCreate={async ({ date, type, reason }) => {
        await api.post(`/gyms/${crag.id}/schedules`, {
          gymId: crag.id,
          date,
          type,
          reason,
        });

        refetch();
        revalidateCrag();
      }}
    />
  );
}
