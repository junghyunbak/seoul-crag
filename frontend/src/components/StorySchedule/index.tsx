import { createPortal } from 'react-dom';

import { Box } from '@mui/material';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFetchSchedules } from '@/hooks';

import { StorySlider } from '@/components/StorySlider';
import { GymScheduleGrid } from '@/components/ScheduleCalendar/ScheduleGrid';
import { MonthNavigation } from '@/components/ScheduleCalendar/MonthNavigation';

import { AnimatePresence } from 'framer-motion';

import dayjs from 'dayjs';

interface DateObject {
  date: string; // 'yyyy-MM-DD'
}

function extractFutureYearMonthDates(data: DateObject[]): Date[] {
  const seen = new Set<string>();
  const today = dayjs().startOf('month'); // 이번 달 1일

  data.forEach(({ date }) => {
    const ym = dayjs(date).format('YYYY-MM');
    const monthStart = dayjs(`${ym}-01`);
    if (!monthStart.isBefore(today)) {
      seen.add(ym);
    }
  });

  return Array.from(seen)
    .sort()
    .map((ym) => dayjs(`${ym}-01`).toDate());
}

export function StorySchedule() {
  const [scheduleStoryCragId, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);

  const { schedules } = useFetchSchedules(scheduleStoryCragId);

  const futureYearMonthDates = extractFutureYearMonthDates(
    (schedules || []).map((schedule) => ({ date: schedule.date }))
  );

  return createPortal(
    <AnimatePresence>
      {scheduleStoryCragId && schedules && (
        // [ ]: dimmed 클릭 시 닫기
        <StorySlider
          contents={futureYearMonthDates.map((date) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <MonthNavigation currentMonth={date} readonly fontColor="white" onPrev={() => {}} onNext={() => {}} />
              <GymScheduleGrid schedules={schedules || []} readOnly currentMonth={date} />
            </Box>
          ))}
          onClose={() => setScheduleStory(null)}
          onComplete={() => setScheduleStory(null)}
          initPaused
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
