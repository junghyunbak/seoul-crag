import { createPortal } from 'react-dom';

import { Box } from '@mui/material';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useExp, useFetchCrag } from '@/hooks';

import { Molecules } from '@/components/molecules';

import { AnimatePresence } from 'framer-motion';

import { addMonths, format } from 'date-fns';

export function CalendarStory() {
  const [scheduleStoryCragId, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);

  const { crag } = useFetchCrag({ cragId: scheduleStoryCragId });

  const { exp } = useExp();

  return createPortal(
    <AnimatePresence>
      {scheduleStoryCragId && crag && (
        <Molecules.Story
          crag={crag}
          contents={[exp.date, addMonths(exp.date, 1)].map((date) => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'white',
              }}
            >
              <Molecules.Calendar
                schedules={crag.schedules}
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
