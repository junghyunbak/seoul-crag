import { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Divider,
  Avatar,
  TextField,
  Button,
  FormControlLabel,
  IconButton,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, DefaultError } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { commentsScheme } from '@/schemas/comment';
import { isBefore } from 'date-fns';
import { grey } from '@mui/material/colors';

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

      {isLoading ? <CircularProgress /> : <CommentList comments={comments ?? []} refetch={refetch} />}

      <Divider sx={{ my: 2 }} />

      <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Box>
  );
}

interface CommentListProps {
  comments: CragComment[];
  refetch: () => void;
}

function CommentList({ comments, refetch }: CommentListProps) {
  const { deleteCommentMutation } = useMutateDeleteComment();

  return (
    <Box>
      {comments
        .sort((a, b) => (isBefore(a.created_at, b.created_at) ? -1 : 1))
        .map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={async (commentId) => {
              const confirmed = window.confirm('정말 삭제하시겠습니까?');

              if (confirmed) {
                await deleteCommentMutation.mutateAsync({ commentId });

                refetch();
              }
            }}
          />
        ))}
    </Box>
  );
}

function CommentItem({ comment, onDelete }: { comment: CragComment; onDelete: (commentId: string) => void }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        mb: 3,
      }}
    >
      <Avatar src={comment.user.profile_image || ''}>{comment.user.username.charAt(0)}</Avatar>
      <Box sx={{ flex: 1, mb: 0.5, overflow: 'hidden' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="subtitle2" sx={{ mr: 0.5 }}>
            {comment.user.username}
          </Typography>
          <Typography variant="caption" color={grey['500']}>
            {comment.created_at.toLocaleString()}
          </Typography>
        </Box>
        <Typography
          component="pre"
          sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
          variant="body2"
          color="text.secondary"
        >
          {comment.content}
        </Typography>
      </Box>
      {onDelete && (
        <IconButton onClick={() => onDelete(comment.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
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
          justifyContent: 'space-between',
        }}
      >
        <FormControlLabel
          control={<Switch checked={isAdminOnly} onChange={(e) => setIsAdminOnly(e.target.checked)} />}
          label="관리자만 보기"
        />

        <Button variant="contained" type="submit" disabled={isSubmitting || !content.trim()}>
          작성
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

const useMutateDeleteComment = () => {
  const deleteCommentMutation = useMutation<void, DefaultError, { commentId: string }>({
    mutationFn: async ({ commentId }) => {
      await api.delete(`/comments/${commentId}`);
    },
  });

  return { deleteCommentMutation };
};
