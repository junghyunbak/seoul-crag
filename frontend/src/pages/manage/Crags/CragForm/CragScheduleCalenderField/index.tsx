import { useContext } from 'react';

import { Box, Typography } from '@mui/material';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { ScheduleCalendar } from '@/components/ScheduleCalendar';

import { useFetchSchedules, useMutateAddSchedule, useMutateDeleteSchedule, useMutateUpdateSchedule } from '@/hooks';

export function CragScheduleCalenderField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const { schedules, refetch } = useFetchSchedules(crag.id);

  const { addScheduleMutation } = useMutateAddSchedule({
    onSettled() {
      refetch();
      revalidateCrag();
    },
  });

  const { deleteScheduleMutation } = useMutateDeleteSchedule({
    onSettled() {
      refetch();
      revalidateCrag();
    },
  });

  const { updateScheduleMutation } = useMutateUpdateSchedule({
    onSettled() {
      refetch();
      revalidateCrag();
    },
  });

  return (
    <Box>
      <Typography variant="h6">운영 일정</Typography>

      <ScheduleCalendar
        schedules={schedules || []}
        onDelete={async (id) => {
          deleteScheduleMutation.mutate({ cragId: crag.id, scheduleId: id });
        }}
        onUpdate={async ({ id, type, reason }) => {
          updateScheduleMutation.mutate({ cragId: crag.id, scheduleId: id, type, reason });
        }}
        onCreate={async ({ date, type, reason }) => {
          addScheduleMutation.mutate({ cragId: crag.id, date, type, reason });
        }}
      />
    </Box>
  );
}
