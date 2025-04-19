import { QUERY_STRING } from '@/constants';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export function useModifyExerciseTimeRange() {
  const navigate = useNavigate();

  const updateExerciseTimeRange = useCallback(
    (range: [number, number], urlSearchParams: URLSearchParams) => {
      urlSearchParams.delete(QUERY_STRING.START_EXERCISE_TIME);
      urlSearchParams.delete(QUERY_STRING.END_EXERCISE_TIME);

      urlSearchParams.append(QUERY_STRING.START_EXERCISE_TIME, range[0].toString());
      urlSearchParams.append(QUERY_STRING.END_EXERCISE_TIME, range[1].toString());

      navigate(`/?${urlSearchParams.toString()}`);
    },
    [navigate]
  );

  return {
    updateExerciseTimeRange,
  };
}
