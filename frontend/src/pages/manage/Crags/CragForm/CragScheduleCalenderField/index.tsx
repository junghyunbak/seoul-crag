import { useContext, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useMutateAddSchedule, useMutateDeleteSchedule, useMutateUpdateSchedule } from '@/hooks';

import { subMonths, addMonths, format } from 'date-fns';

import { ScheduleEditModal } from '@/components/ScheduleEditModal';
import { ScheduleMonthNavigation } from '@/components/ScheduleMonthNavigation';
import { Molecules } from '@/components/molecules';

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

      <Molecules.Calendar
        schedules={crag.schedules}
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
        onUpdate={async (schedule) => {
          updateScheduleMutation.mutate({
            cragId: crag.id,
            scheduleId: schedule.id,
            openDate: schedule.open_date,
            closeDate: schedule.close_date,
            type: schedule.type,
            isAllDay: schedule.is_all_day,
          });
        }}
        onCreate={async (schedule) => {
          addScheduleMutation.mutate({
            cragId: crag.id,
            openDate: schedule.open_date,
            closeDate: schedule.close_date,
            type: schedule.type,
            isAllDay: schedule.is_all_day,
          });
        }}
      />
    </Box>
  );
}
