import { QUERY_STRING, TIME } from '@/constants';
import { useLocation } from 'react-router';

export function useExerciseTimeRange(): {
  exerciseTimeRange: [number, number];
  isUseAllTime: boolean;
} {
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const startExerciseTime = queryParams.get(QUERY_STRING.START_EXERCISE_TIME) || TIME.DEFAULT_START_TIME;
  const endExerciseTime = queryParams.get(QUERY_STRING.END_EXERCISE_TIME) || TIME.DEFAULT_END_TIME;

  const isUseAllTime = +endExerciseTime - +startExerciseTime === 24;

  return {
    exerciseTimeRange: [+startExerciseTime, +endExerciseTime],
    isUseAllTime,
  };
}
