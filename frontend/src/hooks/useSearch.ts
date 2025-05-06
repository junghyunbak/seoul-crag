import { useStore } from '@/store';

import { useShallow } from 'zustand/shallow';

export function useSearch() {
  const [isSearchOpen] = useStore(useShallow((s) => [s.isSearchOpen]));
  const [searchKeyword] = useStore(useShallow((s) => [s.searchKeyword]));
  const [searchSortOption] = useStore(useShallow((s) => [s.searchSortOption]));

  return {
    searchKeyword,
    isSearchOpen,
    searchSortOption,
  };
}
