import { useFetchCrags, useModifySearch } from '@/hooks';

import { Modal, Box, InputBase, Divider, IconButton, Select, MenuItem, Grow } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useSearch } from '@/hooks/useSearch';

import { SORT_OPTIONS } from '@/constants/crag';
import { CragList } from '@/components/CragList';
import { Filter } from '@/components/Filter';

export function Search() {
  const { isSearchOpen } = useSearch();

  const { crags } = useFetchCrags();
  const { searchKeyword, searchSortOption } = useSearch();

  const { updateIsSearchOpen, updateSearchKeyword } = useModifySearch();
  const { updateSearchSortOption } = useModifySearch();

  return (
    <Modal open={isSearchOpen} slots={{ backdrop: () => null }}>
      <Grow in={isSearchOpen}>
        <Box
          sx={{
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            outline: 'none',
          }}
          tabIndex={-1}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => updateIsSearchOpen(false)}>
              <ArrowBackIosNewIcon />
            </IconButton>

            <InputBase
              fullWidth
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

          <Box
            sx={{
              pt: 2,
            }}
          >
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

          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <CragList crags={crags || []} />
          </Box>
        </Box>
      </Grow>
    </Modal>
  );
}
