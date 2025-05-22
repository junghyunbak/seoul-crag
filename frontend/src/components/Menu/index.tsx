import React from 'react';

import { FormControlLabel, Switch, useMediaQuery, Box, Drawer, Button, Divider, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

import { useFetchMe, useMutateLogout, useMap, useModifyMap } from '@/hooks';

import { BooleanParam, useQueryParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { zIndex } from '@/styles';

import { urlService } from '@/utils';
import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
  user?: User;
  onLogout: () => void;
  onLogin: () => void;
  onCopyId: () => void;
  onNavigate: (path: string) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ open, onClose, user, onLogout, onLogin, onNavigate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enabledEdgeIndicator, enabledGpsIndicator } = useMap();

  const [setSelectUserId] = useStore(useShallow((s) => [s.setSelectUserId]));

  const { updateEnabledEdgeIndicator, updateEnabledGpsIndicator } = useModifyMap();

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: zIndex.menu, userSelect: 'none' }}>
      <Box sx={{ width: isMobile ? '80vw' : 360, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {user ? (
            <>
              <Button fullWidth variant="outlined" color="info" onClick={() => setSelectUserId(user.id)}>
                프로필 확인
              </Button>

              {user.roles.some(({ name }) => name === 'owner' || name === 'gym_admin' || name === 'partner_admin') && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onNavigate(urlService.getAbsolutePath('/manage/crags'))}
                >
                  내 암장 관리
                </Button>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={onLogin}
                sx={{ backgroundColor: '#FEE500', color: '#000', '&:hover': { backgroundColor: '#ffeb3b' } }}
              >
                카카오 로그인
              </Button>
            </Box>
          )}
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 2,
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

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ p: 2 }}>
            <Button fullWidth startIcon={<LogoutIcon />} variant="outlined" color="error" onClick={onLogout}>
              로그아웃
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  const { user } = useFetchMe();

  const { logoutMutation } = useMutateLogout();

  const handleLoginButtonClick = () => {
    window.location.href = `/api/auth/kakao?returnTo=${encodeURIComponent(`/${window.location.search}`)}`;
  };

  const handleLogoutButtonClick = () => {
    logoutMutation.mutate();
  };

  const handleMenuClose = () => {
    setIsMenuOpen(null);
  };

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  const handleCopyId = () => {
    if (!user) {
      return;
    }

    navigator.clipboard.writeText(user.id);
  };

  return (
    <SidebarMenu
      open={!!isMenuOpen}
      user={user}
      onNavigate={handleNavigate}
      onClose={handleMenuClose}
      onCopyId={handleCopyId}
      onLogin={handleLoginButtonClick}
      onLogout={handleLogoutButtonClick}
    />
  );
}
