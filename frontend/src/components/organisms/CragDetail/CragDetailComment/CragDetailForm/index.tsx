import { Box, Button, FormControlLabel, Switch, TextField } from '@mui/material';
import { useState } from 'react';
import { useQueryParam, BooleanParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';
import { useFetchMe } from '@/hooks';

interface CommentFormProps {
  onSubmit: (form: { content: string; isAdminOnly: boolean }) => void;
  isSubmitting: boolean;
}

export function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isAdminOnly, setIsAdminOnly] = useState(false);

  const [, setIsMenuOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  const { user } = useFetchMe();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    onSubmit({ content, isAdminOnly });
    setContent('');
    setIsAdminOnly(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <TextField
        label={user ? '댓글을 입력하세요' : '로그인이 필요합니다.'}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
        disabled={!user}
      />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <FormControlLabel
          control={<Switch checked={isAdminOnly} onChange={(e) => setIsAdminOnly(e.target.checked)} />}
          label="관리자만 보기"
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          {!user && (
            <Button variant="contained" onClick={() => setIsMenuOpen(true)}>
              로그인
            </Button>
          )}

          <Button variant="contained" type="submit" disabled={isSubmitting || !content.trim()}>
            작성
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
