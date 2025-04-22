import { createPortal } from 'react-dom';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { StorySlider } from '@/components/StorySlider';
import { GymScheduleCalendar } from '@/components/GymScheduleCalendar';
import { useFetchSchedules } from '@/hooks';

export function ScheduleStory() {
  const [scheduleStoryCragId, setScheduleStory] = useQueryParam(QUERY_STRING.STORY_SCHEDULE, StringParam);

  const { schedules } = useFetchSchedules(scheduleStoryCragId);

  return createPortal(
    <div>
      {scheduleStoryCragId && (
        // [ ]: esc
        // [ ]: 미래의 모든 달력
        <StorySlider
          contents={[<GymScheduleCalendar schedules={schedules || []} readOnly />]}
          onClose={() => setScheduleStory(null)}
          onComplete={() => setScheduleStory(null)}
          initPaused
        />
      )}
    </div>,
    document.body
  );
}
