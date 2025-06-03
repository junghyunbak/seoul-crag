import { Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, CircularProgress } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LandscapeIcon from '@mui/icons-material/Landscape';

import { urlService } from '@/utils';

import { useFetchMe, useModifyProfile, useMutateLogout } from '@/hooks';

export function UserMenu() {
  const { user, isLoading } = useFetchMe();

  const { updateSelectUserId } = useModifyProfile();

  const { logoutMutation } = useMutateLogout();

  const isManager =
    user &&
    user.userRoles.some(({ role: { name } }) => name === 'owner' || name === 'gym_admin' || name === 'partner_admin');

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      {user ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => updateSelectUserId(user.id)}>
              <ListItemIcon>
                <PermIdentityIcon />
              </ListItemIcon>
              <ListItemText>내 프로필</ListItemText>
            </ListItemButton>
          </ListItem>

          {isManager && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => (window.location.href = urlService.getAbsolutePath('/manage/crags'))}>
                <ListItemIcon>
                  <LandscapeIcon />
                </ListItemIcon>
                <ListItemText>내 암장 관리</ListItemText>
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                logoutMutation.mutate();
              }}
            >
              <ListItemIcon>
                <MeetingRoomIcon />
              </ListItemIcon>
              <ListItemText>로그아웃</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                window.location.href = `/api/auth/kakao?returnTo=${encodeURIComponent(`/${window.location.search}`)}`;
              }}
            >
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText>카카오 로그인</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );
}
