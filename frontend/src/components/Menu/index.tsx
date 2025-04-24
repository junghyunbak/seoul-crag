import { Drawer, Box, Button, Typography, Stack } from '@mui/material';

import { MapsUgc } from '@mui/icons-material';

import { useFetchMe, useMutateLogout } from '@/hooks';

import { BooleanParam, useQueryParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';

export function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  const { user } = useFetchMe();

  const { logoutMutation } = useMutateLogout();

  const handleLoginButtonClick = () => {
    window.location.href = '/api/auth/kakao';
  };

  const handleLogoutButtonClick = () => {
    logoutMutation.mutate();
  };

  const handleMenuClose = () => {
    setIsMenuOpen(null);
  };

  return (
    <Drawer anchor="right" open={!!isMenuOpen} onClose={handleMenuClose}>
      <Box
        sx={{
          maxWidth: '300px',
          width: '80dvw',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          p: '2rem',
        }}
      >
        {!user ? (
          <Button
            variant="contained"
            sx={{ gap: '0.5rem', alignItems: 'center', background: '#ffe948', color: 'black' }}
            onClick={handleLoginButtonClick}
          >
            <MapsUgc sx={{ width: '2rem', height: '2rem' }} />
            <Typography fontSize="1.5rem" fontWeight="bold">
              카카오 로그인
            </Typography>
          </Button>
        ) : (
          <Stack sx={{ width: '100%', height: '100%' }} justifyContent="space-around">
            <Stack direction="row" gap={1}>
              <Box
                sx={{
                  p: 1,
                  background: '#ffe948',
                  borderRadius: '0.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MapsUgc sx={{ width: '2rem', height: '2rem' }} />
              </Box>
              <Stack alignContent="space-between">
                <Typography fontWeight="bold">{user.username}</Typography>
                <Typography fontWeight="bold">사용자 식별자</Typography>
              </Stack>
            </Stack>

            <Button variant="outlined" onClick={handleLogoutButtonClick}>
              로그아웃
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}
