import { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useQuery, useMutation, DefaultError } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { commentsScheme } from '@/schemas/comment';

interface CommentSectionProps {
  cragId: string;
}

export default function CommentSection({ cragId }: CommentSectionProps) {
  const { data: comments, isLoading, refetch } = useComments(cragId);
  const { createCommentMutation } = useMutateCreateComment();

  const { mutate: createComment, status } = createCommentMutation;

  const isSubmitting = status === 'pending';

  const handleSubmit = (form: { content: string; isAdminOnly: boolean }) => {
    createComment(
      { ...form, cragId },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom>
        댓글
      </Typography>

      {isLoading ? <CircularProgress /> : <CommentList comments={comments ?? []} />}

      <Divider sx={{ my: 2 }} />

      <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Box>
  );
}

interface CommentListProps {
  comments: CragComment[];
}

function CommentList({ comments }: CommentListProps) {
  return (
    <Box>
      {comments.map((comment) => (
        <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle2">{comment.user.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {comment.content}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

interface CommentFormProps {
  onSubmit: (form: { content: string; isAdminOnly: boolean }) => void;
  isSubmitting: boolean;
}

export function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isAdminOnly, setIsAdminOnly] = useState(false);

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
        label="댓글을 입력하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      <Box
        sx={{
          display: 'flex',
        }}
      >
        <FormControlLabel
          control={<Checkbox checked={isAdminOnly} onChange={(e) => setIsAdminOnly(e.target.checked)} />}
          label="관리자만 보기"
        />

        <Button variant="contained" type="submit" disabled={isSubmitting || !content.trim()}>
          작성하기
        </Button>
      </Box>
    </Box>
  );
}

const useComments = (gymId: string) =>
  useQuery({
    queryKey: ['comments', gymId],
    queryFn: async () => {
      const { data } = await api.get(`/comments/gym/${gymId}`);

      const comments = commentsScheme.parse(data);

      return comments;
    },
  });

type CreateCommentMutateParams = {
  content: string;
  cragId: string;
  isAdminOnly: boolean;
};

const useMutateCreateComment = () => {
  const createCommentMutation = useMutation<void, DefaultError, CreateCommentMutateParams>({
    mutationFn: async ({ content, cragId, isAdminOnly }) => {
      await api.post('/comments', {
        gymId: cragId,
        content,
        is_admin_only: isAdminOnly,
      });
    },
  });

  return {
    createCommentMutation,
  };
};
