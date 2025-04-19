import { Box, InputBase, Typography, Stack, CircularProgress } from '@mui/material';
import { Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState, useRef, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  fontSize?: string;
  placeholder?: string;
  numberOnly?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

export const EditableText = ({
  value,
  onSave,
  fontSize = '1.25rem',
  placeholder = '',
  numberOnly = false,
  min,
  max,
  step,
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(value);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  useEffect(() => {
    setCurrent(value);
  }, [value]);

  const debouncedSave = useCallback(
    debounce(async (newValue: string) => {
      setStatus('saving');
      try {
        await onSave(newValue);
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } catch {
        setStatus('error');
      }
    }, 1000),
    [onSave]
  );

  const cancel = () => {
    setCurrent(value);
    setIsEditing(false);
    setStatus('idle');
  };

  const save = () => {
    if (current !== value) {
      debouncedSave.cancel();
      debouncedSave(current);
    }
    setIsEditing(false);
  };

  return (
    <Box minHeight="40px">
      {isEditing ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            border: '1px solid #ccc',
            borderRadius: 1,
            py: 0.5,
            px: 1,
          }}
        >
          <InputBase
            inputRef={inputRef}
            value={current}
            type={numberOnly ? 'number' : 'string'}
            inputMode={numberOnly ? 'decimal' : 'text'}
            inputProps={
              numberOnly
                ? {
                    min,
                    max,
                    step,
                  }
                : undefined
            }
            onChange={(e) => {
              setCurrent(e.target.value);
              debouncedSave(e.target.value);
            }}
            onBlur={save}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') cancel();
            }}
            fullWidth
            sx={{
              fontSize,
              fontWeight: 500,
              pr: 1,
              '&::placeholder': {
                color: 'gray',
              },
            }}
          />
          {status === 'saving' && <CircularProgress size={16} />}
          {status === 'success' && <CheckIcon fontSize="small" sx={{ color: 'green' }} />}
          {status === 'error' && <CloseIcon fontSize="small" sx={{ color: 'red' }} />}
        </Box>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={() => setIsEditing(true)}
          sx={{
            py: 0.5,
            px: 1,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          {value ? (
            <Typography fontSize={fontSize} fontWeight={500}>
              {value}
            </Typography>
          ) : (
            <Typography fontSize={fontSize} fontWeight={500} sx={{ color: 'gray' }}>
              {placeholder}
            </Typography>
          )}

          <EditIcon fontSize="small" sx={{ color: 'lightgray' }} />
        </Stack>
      )}
    </Box>
  );
};
