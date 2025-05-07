import { createPortal } from 'react-dom';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useFetchCrag, useFilter } from '@/hooks';

import { StorySlider } from '@/components/StorySlider';
import { StoryOperationPage } from '@/components/StoryOperation/StoryOperationPage';

import { AnimatePresence } from 'framer-motion';

import { DAY_TO_INDEX } from '@/constants/time';

export default function StoryOperation() {
  const [operationStoryCragId, setOperationStory] = useQueryParam(QUERY_STRING.STORY_OPERATION, StringParam);

  const { crag } = useFetchCrag({ cragId: operationStoryCragId });

  const { expeditionDay } = useFilter();

  return createPortal(
    <AnimatePresence>
      {operationStoryCragId && crag && (
        <StorySlider
          crag={crag}
          contents={(crag.openingHourOfWeek || [])
            .sort((a, b) => {
              return ((DAY_TO_INDEX[a.day] - expeditionDay + 7) % 7) - ((DAY_TO_INDEX[b.day] - expeditionDay + 7) % 7);
            })
            .map((openingHour) => (
              <StoryOperationPage crag={crag} openingHour={openingHour} />
            ))}
          onClose={() => setOperationStory(null)}
          onComplete={() => setOperationStory(null)}
          initPaused
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
