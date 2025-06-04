import { useContext } from 'react';

import { Box, Typography, CircularProgress } from '@mui/material';

import { useQuery, useMutation, DefaultError } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { commentsScheme } from '@/schemas/comment';

import { CommentList } from './CragDetailCommentList';
import { CommentForm } from './CragDetailForm';

import { CragDetailContext } from '../index.context';

export function CragDetailComment() {
  const { crag } = useContext(CragDetailContext);

  const { comments, isLoading, refetch } = useComments(crag?.id);

  const { createCommentMutation } = useMutateCreateComment();

  const isSubmitting = createCommentMutation.status === 'pending';

  const handleSubmit = (form: { content: string; isAdminOnly: boolean }) => {
    if (!crag) {
      return;
    }

    createCommentMutation.mutate({ ...form, cragId: crag.id }, { onSuccess: () => refetch() });
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        댓글
      </Typography>

      {isLoading ? <CircularProgress /> : <CommentList comments={comments ?? []} refetch={refetch} />}

      <CommentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </Box>
  );
}

// [ ]: 커스텀 훅 폴더로 이동
const useComments = (cragId: string | undefined) => {
  const {
    data: comments,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['comments', cragId],
    queryFn: async () => {
      if (!cragId) {
        return null;
      }

      const { data } = await api.get(`/comments/gym/${cragId}`);

      const comments = commentsScheme.parse(data);

      return comments;
    },
  });

  return { comments, isLoading, refetch };
};

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
