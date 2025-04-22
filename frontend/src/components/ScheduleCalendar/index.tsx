import { useState } from 'react';
import { subMonths, addMonths } from 'date-fns';
import { GymScheduleGrid } from './ScheduleGrid';
import { MonthNavigation } from './MonthNavigation';

import './index.css';

interface CalendarProps {
  schedules: Schedule[];
  onCreate?: (schedule: Schedule) => void;
  onUpdate?: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export function ScheduleCalendar({ schedules, onCreate, onUpdate, onDelete, readOnly = false }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <>
      <MonthNavigation
        currentMonth={currentMonth}
        onPrev={() => setCurrentMonth((prev) => subMonths(prev, 1))}
        onNext={() => setCurrentMonth((prev) => addMonths(prev, 1))}
      />
      <GymScheduleGrid
        currentMonth={currentMonth}
        schedules={schedules}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        readOnly={readOnly}
      />
    </>
  );
}
