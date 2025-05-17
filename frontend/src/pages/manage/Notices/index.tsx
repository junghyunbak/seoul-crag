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
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';
import { z } from 'zod';
import { useState } from 'react';
import { FormTextField } from '@/components/FormTextField';

const NoticeScheme = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.enum(['general', 'update']),
  isPinned: z.boolean(),
  visible: z.boolean(),
  createdAt: z.coerce.date(),
});

const NoticesScheme = z.array(NoticeScheme);

type Notice = z.infer<typeof NoticeScheme>;

export default function Notices() {
  const { data: notices, refetch } = useQuery({
    queryKey: ['notices'],
    queryFn: async () => {
      const { data } = await api.get('/notices');

      const notices = NoticesScheme.parse(data);

      return notices;
    },
  });

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

interface NoticeItemProps {
  initialNotice: Notice;
  onDelete?: () => void;
}

function NoticeItem({ initialNotice, onDelete }: NoticeItemProps) {
  const [queryEnabled, setQueryEnabled] = useState(false);

  const { data: notice, refetch } = useQuery({
    queryKey: ['notice', initialNotice.id],
    queryFn: async () => {
      const { data } = await api.get(`/notices/${initialNotice.id}`);

      const notice = NoticeScheme.parse(data);

      return notice;
    },
    initialData: initialNotice,
    enabled: queryEnabled,
  });

  const patchNoticeMutation = useMutation<void, DefaultError, Partial<Notice>>({
    mutationFn: async (notice) => {
      await api.patch(`/notices/${initialNotice.id}`, {
        title: notice.title,
        content: notice.content,
        category: notice.category,
        isPinned: notice.isPinned,
        visible: notice.visible,
      });
    },
  });

  const onSuccess = () => {
    if (!queryEnabled) {
      setQueryEnabled(true);
    }

    refetch();
  };

  const deleteNoticeMutation = useMutation<void, DefaultError, string>({
    mutationFn: async (id) => {
      await api.delete(`/notices/${id}`);
    },
  });

  return (
    <Box
      sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <FormTextField
        value={notice.title}
        label={'공지 제목'}
        onSave={async (value) => {
          if (!value) {
            alert('제목을 입력해주세요.');
            return;
          }

          await patchNoticeMutation.mutateAsync(
            { title: value },
            {
              onSuccess,
            }
          );
        }}
      />

      <FormTextField
        value={notice.content}
        label={'공지 내용'}
        onSave={async (value) => {
          await patchNoticeMutation.mutateAsync(
            { content: value },
            {
              onSuccess,
            }
          );
        }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>카테고리</InputLabel>
        <Select
          value={notice.category}
          onChange={(e) => {
            const newCategory = e.target.value as Notice['category'];

            patchNoticeMutation.mutate(
              { category: newCategory },
              {
                onSuccess,
              }
            );
          }}
          label="카테고리"
        >
          <MenuItem value="general">일반</MenuItem>
          <MenuItem value="update">업데이트</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={
          <Checkbox
            checked={notice.isPinned}
            onChange={(e) => {
              const newIsPinned = e.target.checked;

              patchNoticeMutation.mutate(
                { isPinned: newIsPinned },
                {
                  onSuccess,
                }
              );
            }}
          />
        }
        label="고정"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={notice.visible}
            onChange={(e) => {
              const newVisible = e.target.checked;

              patchNoticeMutation.mutate(
                { visible: newVisible },
                {
                  onSuccess,
                }
              );
            }}
          />
        }
        label="보이기"
      />

      <Button
        variant="contained"
        color="error"
        onClick={async () => {
          deleteNoticeMutation.mutate(notice.id, {
            onSuccess: () => {
              if (onDelete) {
                onDelete();
              }
            },
          });
        }}
        disabled={deleteNoticeMutation.status === 'pending'}
      >
        {deleteNoticeMutation.status === 'pending' ? '삭제 중...' : '공지사항 삭제'}
      </Button>

      <Typography variant="caption" color="textSecondary">
        {new Date(notice.createdAt).toLocaleDateString()} | {notice.isPinned ? '고정' : '일반'} |{' '}
      </Typography>
    </Box>
  );
}
