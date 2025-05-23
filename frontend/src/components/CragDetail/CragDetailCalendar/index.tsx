import { useContext, useState } from 'react';

import { useExp } from '@/hooks';

import { Box, Typography } from '@mui/material';

import { ScheduleMonthNavigation } from '@/components/ScheduleMonthNavigation';
import { CragDetailContext } from '@/components/CragDetail/index.context';
import { Calendar } from '@/components/Calendar';

import { format, subMonths, addMonths } from 'date-fns';

export function CragDetailCalendar() {
  const { crag } = useContext(CragDetailContext);

  const { exp } = useExp();

  const [currentMonth, setCurrentMonth] = useState(exp.date);

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

      <Calendar schedules={crag.schedules} onScheduleClick={() => {}} targetMonth={format(currentMonth, 'yyyy-MM')} />
    </Box>
  );
}
