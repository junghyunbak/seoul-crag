import { useLocation } from 'react-router';

import { QUERY_STRING } from '@/constants';

export function useMenu() {
  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);

  const isMenuOpen = queryParams.get(QUERY_STRING.MENU) !== null;

  return { isMenuOpen };
}
