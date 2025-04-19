import { Box, Typography, TextareaAutosize, Stack } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/system';

interface EditableTextareaProps {
  value: string;
  onSave: (newValue: string) => void;
  fontSize?: string;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}

const StyledTextarea = styled(TextareaAutosize)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  padding: '8px 12px',
  width: '100%',
  resize: 'vertical',
  borderRadius: 8,
  border: '1px solid #ccc',
  fontFamily: theme.typography.fontFamily,
  transition: 'all 0.2s ease-in-out',
  '&:focus': {
    outline: `2px solid ${theme.palette.primary.light}`,
  },
}));

export const EditableTextarea = ({
  value,
  onSave,
  fontSize = '1rem',
  placeholder = '',
  minRows = 3,
  maxRows = 10,
}: EditableTextareaProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  const cancel = () => {
    setCurrent(value);
    setIsEditing(false);
  };

  const save = () => {
    if (current !== value) onSave(current);
    setIsEditing(false);
  };

  return (
    <Box minHeight="80px">
      {isEditing ? (
        <StyledTextarea
          ref={textareaRef}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === 'Escape') cancel();
          }}
          minRows={minRows}
          maxRows={maxRows}
        />
      ) : (
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          onClick={() => setIsEditing(true)}
          sx={{
            padding: 1,
            borderRadius: 1,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <Typography fontSize={fontSize} fontWeight={500} sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}>
            {value || placeholder}
          </Typography>
          <EditIcon sx={{ fontSize: '1rem', color: 'gray', marginTop: '2px' }} />
        </Stack>
      )}
    </Box>
  );
};
