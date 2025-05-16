import { DefaultError, useMutation } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { useEffect, useState } from 'react';
import { Box, TextField, Button, MenuItem, Select, SelectChangeEvent, Paper } from '@mui/material';
import { useFetchTags } from '@/hooks';
import { TAG_NAMES } from '@/constants/tag';
import { TagList } from '@/components/TagList';

export function Tags() {
  const { tags, refetch } = useFetchTags();

  const createTagMutation = useMutation<void, DefaultError, Tag>({
    mutationFn: async ({ name, type }) => {
      await api.post('/tags', {
        name,
        type,
      });
    },
  });

  const deleteTagMutation = useMutation<void, DefaultError, Tag>({
    mutationFn: async ({ id }) => {
      await api.delete(`/tags/${id}`);
    },
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        p: 2,
      }}
    >
      <TagEditor
        initialTags={tags}
        tagTypes={TAG_NAMES}
        onAdd={(tag) => {
          createTagMutation.mutate(tag, {
            onSuccess() {
              refetch();
            },
          });
        }}
        onRemove={async (tag) => {
          deleteTagMutation.mutate(tag, {
            onSuccess() {
              refetch();
            },
          });
        }}
      />
    </Box>
  );
}

interface TagEditorProps {
  initialTags?: Tag[];
  tagTypes: TagType[];
  onRemove?: (tag: Tag) => void;
  onAdd?: (tag: Tag) => void;
}

export function TagEditor({ initialTags = [], tagTypes, onRemove, onAdd }: TagEditorProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [input, setInput] = useState('');
  const [type, setType] = useState<TagType>(tagTypes[0] || 'board');

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const addTag = () => {
    const name = input.trim();

    if (!name || tags.find((t) => t.name === name && t.type === type)) return;

    const newTag: Tag = { id: '', name, type, created_at: new Date() };
    const updated = [...tags, newTag];

    setTags(updated);
    setInput('');

    onAdd?.(newTag);
  };

  const removeTag = (target: Tag) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');

    if (!confirmed) {
      return;
    }

    const updated = tags.filter((tag) => tag.name !== target.name || tag.type !== target.type);

    setTags(updated);

    onRemove?.(target);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper>
        <TagList tags={tags} onClick={removeTag} />
      </Paper>

      {/* 입력 폼 */}
      <Box display="flex" gap={1}>
        <TextField
          label="태그 이름"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          fullWidth
        />

        <Select value={type} onChange={(e: SelectChangeEvent) => setType(e.target.value as TagType)} size="small">
          {tagTypes.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={addTag}>
          추가
        </Button>
      </Box>
    </Box>
  );
}
