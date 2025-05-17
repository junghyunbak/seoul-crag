import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { DefaultError, useMutation } from '@tanstack/react-query';

import { api } from '@/api/axios';
import { useState } from 'react';

import { useFetchNotices } from '@/hooks';

import { NoticeItem } from './NoticeItem';

export default function Notices() {
  const { notices, refetch } = useFetchNotices();

  const createNoticeMutation = useMutation<void, DefaultError, MyOmit<Notice, 'id' | 'createdAt'>>({
    mutationFn: async ({ title, content, category, isPinned, visible }) => {
      await api.post('/notices', {
        title,
        content,
        category,
        isPinned,
        visible,
      });
    },
  });

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Notice['category']>('general');
  const [isPinned, setIsPinned] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleCreateNotice = () => {
    if (!title || !content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    createNoticeMutation.mutate(
      {
        title,
        content,
        category,
        isPinned,
        visible,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );

    setTitle('');
    setContent('');
    setCategory('general');
    setIsPinned(false);
    setVisible(false);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          공지사항 생성
        </Typography>

        <TextField label="제목" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth margin="normal" />
        <TextField
          label="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>카테고리</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value as Notice['category'])} label="카테고리">
            <MenuItem value="general">일반</MenuItem>
            <MenuItem value="update">업데이트</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Checkbox checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />}
          label="고정"
        />
        <FormControlLabel
          control={<Checkbox checked={visible} onChange={(e) => setVisible(e.target.checked)} />}
          label="보이기"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNotice}
          disabled={createNoticeMutation.status === 'pending'}
        >
          {createNoticeMutation.status === 'pending' ? '생성 중...' : '공지사항 생성'}
        </Button>
      </Box>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          공지사항 목록
        </Typography>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {notices?.map((notice) => (
          <NoticeItem
            key={notice.id}
            initialNotice={notice}
            onDelete={() => {
              refetch();
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
