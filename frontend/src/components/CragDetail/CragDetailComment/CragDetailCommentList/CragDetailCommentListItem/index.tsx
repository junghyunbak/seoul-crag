import { Avatar, Box, Typography, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import ShieldIcon from '@mui/icons-material/AdminPanelSettings';
import DeleteIcon from '@mui/icons-material/Delete';

interface CommentItemProps {
  comment: CragComment;
  onDelete: (commentId: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
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
