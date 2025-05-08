import React, { useEffect, useRef } from 'react';

import { useFetchCrags, useModifySearch } from '@/hooks';

import { Modal, Box, InputBase, Divider, IconButton, Select, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useSearch } from '@/hooks/useSearch';

import { SORT_OPTIONS } from '@/constants/crag';
import { CragList } from '@/components/CragList';
import { Filter } from '@/components/Filter';

export function Search() {
  const { isSearchOpen } = useSearch();

  return (
    <Modal open={isSearchOpen}>
      <SearchContent isOpen={isSearchOpen} />
    </Modal>
  );
}

interface SearchContentProps {
  isOpen: boolean;
}

const SearchContent = React.forwardRef(({ isOpen }: SearchContentProps, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { crags } = useFetchCrags();
  const { searchKeyword, searchSortOption } = useSearch();

  const { updateIsSearchOpen, updateSearchKeyword } = useModifySearch();
  const { updateSearchSortOption } = useModifySearch();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Box
      sx={{ background: 'white', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
      ref={ref}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => updateIsSearchOpen(false)}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <InputBase
          fullWidth
          inputRef={inputRef}
          value={searchKeyword}
          onChange={(e) => updateSearchKeyword(e.target.value)}
          placeholder="클라이밍장 검색"
        />
        {searchKeyword && (
          <IconButton size="small" onClick={() => updateSearchKeyword('')}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider />

      <Box sx={{ pt: 2 }}>
        <Filter />
      </Box>

      <Box sx={{ p: 2, width: '100%' }}>
        <Select
          value={searchSortOption}
          fullWidth
          onChange={(e) => updateSearchSortOption(e.target.value as SortOption)}
        >
          {Object.entries(SORT_OPTIONS).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Divider />

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <CragList crags={crags || []} />
      </Box>
    </Box>
  );
});
