import { Select, MenuItem } from '@mui/material';

import { SORT_OPTIONS } from '@/constants/crag';

import { useModifySearch, useSearch } from '@/hooks';

export function SortOptionSelector() {
  const { searchSortOption } = useSearch();

  const { updateSearchSortOption } = useModifySearch();

  return (
    <Select value={searchSortOption} fullWidth onChange={(e) => updateSearchSortOption(e.target.value as SortOption)}>
      {Object.entries(SORT_OPTIONS).map(([key, label]) => (
        <MenuItem key={key} value={key}>
          {label}
        </MenuItem>
      ))}
    </Select>
  );
}
