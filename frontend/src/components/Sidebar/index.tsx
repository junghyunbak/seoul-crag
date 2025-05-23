import {
  FormControlLabel,
  Switch,
  useMediaQuery,
  Box,
  Drawer,
  useTheme,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import LandscapeIcon from '@mui/icons-material/Landscape';

import { useFetchMe, useMutateLogout, useMap, useModifyMap } from '@/hooks';

import { BooleanParam, useQueryParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { zIndex } from '@/styles';

import { urlService } from '@/utils';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

export function Sidebar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isOpen, setIsOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  const open = Boolean(isOpen);

  const handleClose = () => {
    setIsOpen(null);
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose} sx={{ zIndex: zIndex.menu, userSelect: 'none' }}>
      <Box sx={{ width: isMobile ? '80vw' : 360, display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
        <Logo />
        <Menu />

        <Box sx={{ flexGrow: 1 }} />

        <Options />
      </Box>
    </Drawer>
  );
}

function Logo() {
  return (
    <Typography variant="h3" gutterBottom>
      서울암장
    </Typography>
  );
}

function Menu() {
  const { user, isLoading } = useFetchMe();

  const [setSelectUserId] = useStore(useShallow((s) => [s.setSelectUserId]));

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
            <ListItemButton onClick={() => setSelectUserId(user.id)}>
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

function Options() {
  const { enabledEdgeIndicator, enabledGpsIndicator } = useMap();

  const { updateEnabledEdgeIndicator, updateEnabledGpsIndicator } = useModifyMap();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FormControlLabel
        control={
          <Switch
            checked={enabledEdgeIndicator}
            onChange={() => {
              updateEnabledEdgeIndicator(!enabledEdgeIndicator);
            }}
          />
        }
        label="화면 밖 암장 표시"
      />
      <FormControlLabel
        control={
          <Switch
            checked={enabledGpsIndicator}
            onChange={() => {
              updateEnabledGpsIndicator(!enabledGpsIndicator);
            }}
          />
        }
        label="화면 밖 내 위치 표시"
      />
    </Box>
  );
}
