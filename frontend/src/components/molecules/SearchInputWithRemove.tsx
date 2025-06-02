import { Box, IconButton, InputBase } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

export function SearchInputWithRemove({
  value,
  onChange,
  onRemove,
  placeholder = '',
}: {
  value: string;
  onChange(value: string): void;
  onRemove(): void;
  placeholder?: string;
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <InputBase
        fullWidth
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        value={value}
        sx={(theme) => ({
          '& input::placeholder': {
            color: theme.palette.grey[600],
            opacity: 1,
          },
        })}
      />

      {value && (
        <IconButton onClick={onRemove}>
          <CloseIcon />
        </IconButton>
      )}
    </Box>
  );
}
