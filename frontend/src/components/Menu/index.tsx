import React from 'react';

import { useMediaQuery, Box, Drawer, Avatar, Typography, IconButton, Button, Divider, useTheme } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Edit from '@mui/icons-material/Edit';

import { useFetchMe, useMutateLogout } from '@/hooks';

import { BooleanParam, useQueryParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

import { zIndex } from '@/styles';

import { urlService } from '@/utils';

interface SidebarMenuProps {
  open: boolean;
  onClose: () => void;
  user?: User;
  onLogout: () => void;
  onLogin: () => void;
  onCopyId: () => void;
  onNavigate: (path: string) => void;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  open,
  onClose,
  user,
  onLogout,
  onLogin,
  onCopyId,
  onNavigate,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: zIndex.menu }}>
      <Box sx={{ width: isMobile ? '75vw' : 360, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ p: 3 }}>
          {user ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={user.profile_image || ''}>{user.username}</Avatar>
                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    <IconButton size="small" onClick={() => onNavigate(urlService.getAbsolutePath('/manage'))}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {user.id}
                    </Typography>
                    <IconButton size="small" onClick={onCopyId}>
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {user.roles.some(({ name }) => name === 'owner' || name === 'gym_admin' || name === 'partner_admin') && (
                <Box sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => onNavigate(urlService.getAbsolutePath('/manage/crags'))}
                  >
                    내 암장 관리
                  </Button>
                </Box>
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

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ p: 2 }}>
            <Divider sx={{ mb: 2 }} />
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
