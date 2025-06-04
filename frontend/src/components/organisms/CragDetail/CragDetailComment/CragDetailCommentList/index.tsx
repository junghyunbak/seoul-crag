import { Box } from '@mui/material';

import { useMutation } from '@tanstack/react-query';
import { DefaultError } from '@tanstack/react-query';

import { api } from '@/api/axios';

import { isBefore } from 'date-fns';

import { CommentItem } from './CragDetailCommentListItem';

// [ ]: 커스텀 훅 폴더로 이동
const useMutateDeleteComment = () => {
  const deleteCommentMutation = useMutation<void, DefaultError, { commentId: string }>({
    mutationFn: async ({ commentId }) => {
      await api.delete(`/comments/${commentId}`);
    },
  });

  return { deleteCommentMutation };
};

interface CommentListProps {
  comments: CragComment[];
  refetch: () => void;
}

export function CommentList({ comments, refetch }: CommentListProps) {
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
