import { useContext, useState } from 'react';

import { useFilter } from '@/hooks';

import { Box, Typography } from '@mui/material';

import { ScheduleMonthNavigation } from '@/components/ScheduleMonthNavigation';
import { Schedule } from '@/components/Schedule';

import { subMonths, addMonths } from 'date-fns';

import { CragDetailContext } from '@/components/CragDetail/index.context';

export function CragDetailCalendar() {
  const { crag } = useContext(CragDetailContext);

  const { expeditionDate } = useFilter();

  const [currentMonth, setCurrentMonth] = useState(expeditionDate);

  if (!crag) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        일정표
      </Typography>

      <ScheduleMonthNavigation
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
        onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
      />
      <Schedule
        currentMonth={currentMonth}
        schedules={crag.futureSchedules || []}
        onScheduleElementClick={() => {}}
        readOnly
      />
    </Box>
  );
}
