import { useContext, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useMutateAddSchedule, useMutateDeleteSchedule, useMutateUpdateSchedule } from '@/hooks';

import { subMonths, addMonths, format } from 'date-fns';

import { ScheduleEditModal } from '@/components/ScheduleEditModal';
import { ScheduleMonthNavigation } from '@/components/ScheduleMonthNavigation';
import { Calendar } from '@/components/Calendar';

export function CragScheduleCalenderField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { addScheduleMutation } = useMutateAddSchedule({
    onSettled() {
      revalidateCrag();
    },
  });

  const { deleteScheduleMutation } = useMutateDeleteSchedule({
    onSettled() {
      revalidateCrag();
    },
  });

  const { updateScheduleMutation } = useMutateUpdateSchedule({
    onSettled() {
      revalidateCrag();
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6">운영 일정</Typography>

      <ScheduleMonthNavigation
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
        onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
      />

      <Calendar
        schedules={crag.futureSchedules || []}
        targetMonth={format(currentMonth, 'yyyy-MM')}
        onScheduleClick={(schedule) => setSelectedSchedule(schedule)}
      />

      <ScheduleEditModal
        schedule={selectedSchedule}
        onClick={() => {
          setSelectedSchedule(null);
        }}
        onClose={() => {
          setSelectedSchedule(undefined);
        }}
        onDelete={async (scheduleId) => {
          deleteScheduleMutation.mutate({ cragId: crag.id, scheduleId });
        }}
        onUpdate={async (scheduleId, openDate, closeDate, type) => {
          updateScheduleMutation.mutate({ cragId: crag.id, scheduleId, openDate, closeDate, type });
        }}
        onCreate={async (openDate, closeDate, type) => {
          addScheduleMutation.mutate({ cragId: crag.id, openDate, closeDate, type });
        }}
      />
    </Box>
  );
}
