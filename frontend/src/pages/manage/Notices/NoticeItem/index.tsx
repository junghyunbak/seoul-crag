import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { DefaultError, useMutation, useQuery } from '@tanstack/react-query';

import { api } from '@/api/axios';
import { useState } from 'react';
import { FormTextField } from '@/components/FormTextField';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

import { NoticeScheme } from '@/schemas/notice';

interface NoticeItemProps {
  initialNotice: Notice;
  onDelete?: () => void;
}

export function NoticeItem({ initialNotice, onDelete }: NoticeItemProps) {
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
        {format(new Date(notice.createdAt), 'yyyy-MM-dd a hh:mm', { locale: ko })}
      </Typography>
    </Box>
  );
}
