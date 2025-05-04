import { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  TextField,
  Button,
  FormControlLabel,
  IconButton,
  Switch,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useQuery, useMutation, DefaultError } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { commentsScheme } from '@/schemas/comment';
import { isBefore } from 'date-fns';
import { grey } from '@mui/material/colors';
import { useFetchMe } from '@/hooks';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';

interface CragDetailCommentProps {
  cragId: string;
}

export function CragDetailComment({ cragId }: CragDetailCommentProps) {
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
            gap: 0.5,
          }}
        >
          <Typography variant="subtitle2">{comment.user.username}</Typography>
          <Typography variant="caption" color={grey['500']}>
            {comment.created_at.toLocaleString()}
          </Typography>
          {comment.is_admin_only && <ShieldIcon sx={{ color: grey['500'], width: 12, height: 12 }} />}
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
