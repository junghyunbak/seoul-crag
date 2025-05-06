import { Box, Typography, CircularProgress } from '@mui/material';

import { useQuery, useMutation, DefaultError } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { commentsScheme } from '@/schemas/comment';

import { CommentList } from '@/components/CragDetail/CragDetailComment/CragDetailCommentList';
import { CommentForm } from '@/components/CragDetail/CragDetailComment/CragDetailForm';

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

// [ ]: 커스텀 훅 폴더로 이동
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
