import { useStore } from '@/store';
import { useCallback } from 'react';
import { useShallow } from 'zustand/shallow';

export function useModifySearch() {
  const [setIsSearchOpen] = useStore(useShallow((s) => [s.setIsSearchOpen]));
  const [setSearchKeyword] = useStore(useShallow((s) => [s.setSearchKeyword]));
  const [setSearchSortOption] = useStore(useShallow((s) => [s.setSearchSortOption]));

  const updateIsSearchOpen = useCallback(
    (isOpen: boolean) => {
      setIsSearchOpen(isOpen);
    },
    [setIsSearchOpen]
  );

  const updateSearchKeyword = useCallback(
    (keyword: string) => {
      setSearchKeyword(keyword);
    },
    [setSearchKeyword]
  );

  const updateSearchSortOption = useCallback(
    (sortOption: SortOption) => {
      setSearchSortOption(sortOption);
    },
    [setSearchSortOption]
  );

  return {
    updateIsSearchOpen,
    updateSearchKeyword,
    updateSearchSortOption,
  };
}
