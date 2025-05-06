import { type StateCreator } from 'zustand';

type SearchSliceType = {
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;

  searchKeyword: string;
  setSearchKeyword: (searchKeyword: string) => void;

  searchSortOption: SortOption;
  setSearchSortOption: (searchSortOption: SortOption) => void;
};

export const createSearchSlice: StateCreator<SearchSliceType> = (set): SearchSliceType => ({
  isSearchOpen: false,
  setIsSearchOpen(isOpen: boolean) {
    set(() => ({ isSearchOpen: isOpen }));
  },

  searchKeyword: '',
  setSearchKeyword(searchKeyword: string) {
    set(() => ({ searchKeyword }));
  },

  searchSortOption: 'distance',
  setSearchSortOption(searchSortOption: SortOption) {
    set(() => ({ searchSortOption }));
  },
});
