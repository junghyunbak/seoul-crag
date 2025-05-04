import { createPortal } from 'react-dom';

import { Box } from '@mui/material';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFetchCrag, useFilter } from '@/hooks';

import { StorySlider } from '@/components/StorySlider';

import { Schedule } from '../Schedule';
import { ScheduleMonthNavigation } from '../ScheduleMonthNavigation';

import { AnimatePresence } from 'framer-motion';

import { addMonths } from 'date-fns';

export default function StorySchedule() {
  const [scheduleStoryCragId, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);

  const { crag } = useFetchCrag({ cragId: scheduleStoryCragId });

  const { expeditionDate } = useFilter();

  return createPortal(
    <AnimatePresence>
      {scheduleStoryCragId && crag && (
        <StorySlider
          crag={crag}
          contents={[expeditionDate, addMonths(expeditionDate, 1)].map((date) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <ScheduleMonthNavigation
                currentMonth={date}
                readonly
                fontColor="white"
                onPrev={() => {}}
                onNext={() => {}}
              />
              <Schedule
                schedules={crag.futureSchedules || []}
                readOnly
                currentMonth={date}
                onScheduleElementClick={() => {}}
              />
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
