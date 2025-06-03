import { Box, Avatar, AvatarGroup, Typography, IconButton } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import { urlService } from '@/utils';

export function UserProfile({ user, me }: { user: User; me?: User }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          pt: '48px',
          pb: 2,
          px: 3,
        }}
      >
        <Avatar src={user.profile_image || ''} sx={{ width: 64, height: 64, border: '3px solid white' }}>
          {user.username}
        </Avatar>

        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user.username}
          </Typography>
          <Typography component="span" sx={(theme) => ({ color: theme.palette.text.secondary })}>
            {`#${user.id.slice(0, 6)}`}
          </Typography>
          {user.id === me?.id && (
            <IconButton size="small" onClick={() => (window.location.href = urlService.getAbsolutePath('/manage'))}>
              <Edit fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>

      <Typography variant="h6">기여한 암장</Typography>

      {/**
       * 한 암장에 두개 이상의 기여가 가능하기 때문에, 키값에 인덱스값 까지 포함.
       *
       * // TODO: 중복 기여 암장 제거 예정
       */}
      <AvatarGroup total={user.gymUserContributions.length}>
        {user.gymUserContributions.map(({ gym }, i) => {
          return (
            <Avatar key={`${gym.id}-${i}`} src={gym.thumbnail_url || ''}>
              {gym.name[0]}
            </Avatar>
          );
        })}
      </AvatarGroup>
    </Box>
  );
}
