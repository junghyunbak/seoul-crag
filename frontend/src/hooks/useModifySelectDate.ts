import { QUERY_STRING } from '@/constants';
import { Dayjs } from 'dayjs';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';

export function useModifySelectDate() {
  const navigate = useNavigate();

  const updateSelectDate = useCallback(
    (date: Dayjs | null, urlSearchParams: URLSearchParams) => {
      urlSearchParams.delete(QUERY_STRING.SELECT_DATE);

      if (date) {
        urlSearchParams.append(QUERY_STRING.SELECT_DATE, date.format('YYYY-MM-DD'));
      }

      navigate(`/?${urlSearchParams.toString()}`);
    },
    [navigate]
  );

  return { updateSelectDate };
}
