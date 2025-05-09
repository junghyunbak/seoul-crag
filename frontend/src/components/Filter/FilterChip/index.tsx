import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface FilterChipProps {
  isSelect: boolean;
  onClick: () => void;
  label: string;
  emoji: string;
}

export function FilterChip({ isSelect, onClick, label, emoji }: FilterChipProps) {
  const theme = useTheme();

  return (
    <Box
      className=""
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        cursor: 'pointer',
        width: 'fit-content',
        py: 1,
        px: 1.5,
        borderRadius: 3,
        background: isSelect ? theme.palette.secondary.main : theme.palette.common.white,
        boxShadow: 1,
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',

          width: 21,
          height: 21,

          fontSize: '1rem',
        }}
      >
        {emoji}
      </Box>

      <Typography fontSize={'1rem'} color={isSelect ? 'white' : theme.palette.text.primary}>
        {label}
      </Typography>
    </Box>
  );
}

interface InputFilterChipProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isSelect: boolean;
  emoji: string;
  onDelete?: () => void;
}

export const InputFilterChip = React.forwardRef<HTMLInputElement, InputFilterChipProps>(
  ({ value, onClick, isSelect, emoji, onDelete, ...rest }, ref) => {
    const theme = useTheme();

    return (
      <Box
        className=""
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          cursor: 'pointer',
          width: 'fit-content',
          py: 1,
          px: 1.5,
          borderRadius: 3,
          background: isSelect ? theme.palette.secondary.main : theme.palette.common.white,
          boxShadow: 1,
        }}
        onClick={onClick}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',

            width: 21,
            height: 21,

            fontSize: '1rem',
          }}
        >
          {emoji}
        </Box>

        <Typography fontSize={'1rem'} color={isSelect ? 'white' : theme.palette.text.primary}>
          {value}
        </Typography>

        {isSelect && (
          <DeleteIcon
            sx={{
              color: isSelect ? 'white' : 'text.secondary',
            }}
            onClick={(e) => {
              e.stopPropagation();

              onDelete?.();
            }}
          />
        )}

        <input
          ref={ref}
          value={value}
          readOnly
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            pointerEvents: 'none',
          }}
          {...rest}
        />
      </Box>
    );
  }
);
