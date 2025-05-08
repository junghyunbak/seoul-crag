import { createPortal } from 'react-dom';

import { Box } from '@mui/material';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useExp, useFetchCrag } from '@/hooks';

import { StorySlider } from '@/components/StorySlider';
import { Calendar } from '@/components/Calendar';

import { AnimatePresence } from 'framer-motion';

import { format } from 'date-fns';

export default function StorySchedule() {
  const [scheduleStoryCragId, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);

  const { crag } = useFetchCrag({ cragId: scheduleStoryCragId });

  const { exp } = useExp();

  return createPortal(
    <AnimatePresence>
      {scheduleStoryCragId && crag && (
        <StorySlider
          crag={crag}
          contents={[exp.date].map((date) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
              }}
            >
              <Calendar
                schedules={crag.futureSchedules || []}
                onScheduleClick={() => {}}
                targetMonth={format(date, 'yyyy-MM')}
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
