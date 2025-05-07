import { createPortal } from 'react-dom';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { useExp, useFetchCrag } from '@/hooks';

import { StorySlider } from '@/components/StorySlider';
import { StoryOperationPage } from '@/components/StoryOperation/StoryOperationPage';

import { AnimatePresence } from 'framer-motion';

import { addDays } from 'date-fns';

export default function StoryOperation() {
  const [operationStoryCragId, setOperationStory] = useQueryParam(QUERY_STRING.STORY_OPERATION, StringParam);

  const { crag } = useFetchCrag({ cragId: operationStoryCragId });

  const { exp } = useExp();

  return createPortal(
    <AnimatePresence>
      {operationStoryCragId && crag && (
        <StorySlider
          crag={crag}
          contents={Array(7)
            .fill(null)
            .map((_, i) => {
              const date = addDays(exp.date, i);

              return <StoryOperationPage key={i} crag={crag} date={date} />;
            })}
          onClose={() => setOperationStory(null)}
          onComplete={() => setOperationStory(null)}
          initPaused
        />
      )}
    </AnimatePresence>,
    document.body
  );
}
