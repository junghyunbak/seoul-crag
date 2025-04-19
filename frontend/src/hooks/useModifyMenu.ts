import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { QUERY_STRING } from '@/constants';

export function useModifyMenu() {
  const navigate = useNavigate();

  const updateIsMenuOpen = useCallback(
    (isOpen: boolean, urlSearchParams: URLSearchParams) => {
      urlSearchParams.delete(QUERY_STRING.MENU);

      if (isOpen) {
        urlSearchParams.append(QUERY_STRING.MENU, 'open');
      }

      navigate(`/?${urlSearchParams.toString()}`);
    },
    [navigate]
  );

  return {
    updateIsMenuOpen,
  };
}
