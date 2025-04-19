import { useLocation } from 'react-router';

import { QUERY_STRING } from '@/constants';

import dayjs, { Dayjs } from 'dayjs';

export function useSelectDate() {
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const selectDate: Dayjs | null = queryParams.has(QUERY_STRING.SELECT_DATE)
    ? dayjs(queryParams.get(QUERY_STRING.SELECT_DATE))
    : null;

  return { selectDate };
}
