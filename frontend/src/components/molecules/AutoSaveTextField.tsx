import React, { useEffect, useRef, useState } from 'react';

import { TextField, CircularProgress, InputAdornment } from '@mui/material';
import Check from '@mui/icons-material/Check';
import Error from '@mui/icons-material/Error';

interface AutoSaveTextFieldProps {
  value: string | null | undefined;

  placeholder?: string;

  multilineCount?: number;

  label?: string;

  helperText?: string;

  onSave: (next: string) => Promise<void>;
}

export function AutoSaveTextField({
  value = '',
  onSave,
  placeholder,
  label,
  helperText,
  multilineCount,
}: AutoSaveTextFieldProps) {
  const [text, setText] = useState(value);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleSave = async (targetValue: string) => {
    try {
      await onSave(targetValue);

      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setText(e.target.value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setStatus('saving');

    timeoutRef.current = setTimeout(() => {
      handleSave(e.target.value);
    }, 800);
  };

  const handleBlur = () => {
    setStatus('idle');
  };

  const getEndAdornment = () => {
    if (status === 'saving') return <CircularProgress size={16} thickness={5} />;
    if (status === 'success') return <Check color="success" fontSize="small" />;
    if (status === 'error') return <Error color="error" fontSize="small" />;
    return null;
  };

  return (
    <TextField
      variant="filled"
      fullWidth
      value={text}
      placeholder={placeholder}
      label={label}
      onChange={handleInputChange}
      onBlur={handleBlur}
      multiline={typeof multilineCount === 'number'}
      rows={multilineCount}
      error={status === 'error'}
      helperText={status === 'error' ? helperText : undefined}
      InputProps={{
        endAdornment: <InputAdornment position="end">{getEndAdornment()}</InputAdornment>,
      }}
    />
  );
}
