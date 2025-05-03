import { useContext, useState } from 'react';

import { Box, Typography } from '@mui/material';

import { cragFormContext } from '@/pages/manage/Crags/CragForm/index.context';

import { useFetchSchedules, useMutateAddSchedule, useMutateDeleteSchedule, useMutateUpdateSchedule } from '@/hooks';

import { subMonths, addMonths, isBefore, isEqual } from 'date-fns';

import { Schedule } from '@/components/Schedule';
import { ScheduleEditModal } from '@/components/ScheduleEditModal';
import { ScheduleMonthNavigation } from '@/components/ScheduleMonthNavigation';

import { time } from '@/utils';

export function CragScheduleCalenderField() {
  const { crag, revalidateCrag } = useContext(cragFormContext);

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null | undefined>(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="h6">운영 일정</Typography>

      <ScheduleMonthNavigation
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
        onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
      />

      <Schedule
        currentMonth={currentMonth}
        schedules={schedules || []}
        onScheduleElementClick={(schedule) => {
          setSelectedSchedule(schedule);
        }}
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
          if (
            isEqual(time.dateTimeStrToDate(openDate), time.dateTimeStrToDate(closeDate)) ||
            isBefore(time.dateTimeStrToDate(openDate), time.dateTimeStrToDate(closeDate))
          ) {
            updateScheduleMutation.mutate({ cragId: crag.id, scheduleId, openDate, closeDate, type });
          } else {
            alert('마감 시간이 오픈 시간보다 먼저일 수 없습니다.');
          }
        }}
        onCreate={async (openDate, closeDate, type) => {
          if (
            isEqual(time.dateTimeStrToDate(openDate), time.dateTimeStrToDate(closeDate)) ||
            isBefore(time.dateTimeStrToDate(openDate), time.dateTimeStrToDate(closeDate))
          ) {
            addScheduleMutation.mutate({ cragId: crag.id, openDate, closeDate, type });
          } else {
            alert('마감 시간이 오픈 시간보다 먼저일 수 없습니다.');
          }
        }}
      />
    </Box>
  );
}
