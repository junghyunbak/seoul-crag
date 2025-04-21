import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';

import { Box, IconButton, Typography } from '@mui/material';
import { Dashboard, Foundation, ManageAccounts, MenuOpen, SupervisorAccount, Terrain } from '@mui/icons-material';

import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';

import { Link } from 'react-router';
import { useFetchMe } from '@/hooks';

export function ManagePage() {
  const location = useLocation();

  const [toggled, setToggled] = useState(false);

  const { user } = useFetchMe();

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      {/**
       * xl === (mui)lg 1200px
       */}
      <Sidebar breakPoint="xl" toggled={toggled} onBackdropClick={() => setToggled(false)} backgroundColor="white">
        <Menu
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  color: '#b6c8d9',
                  backgroundColor: active ? '#13395e' : undefined,

                  '&:hover': {
                    backgroundColor: '#13395e',
                  },
                };
            },
          }}
        >
          <Typography variant="h3" sx={{ p: '0 20px', m: '32px 0 8px 0' }}>
            서울 암장
          </Typography>

          <MenuItem icon={<ManageAccounts />} component={<Link to="" />} active={location.pathname === '/manage'}>
            내 정보 수정
          </MenuItem>

          <Typography fontWeight="bold" sx={{ p: '0 20px', m: '32px 0 8px 0' }}>
            관리자 메뉴
          </Typography>

          <MenuItem icon={<Terrain />} component={<Link to="crags" />} active={location.pathname === '/manage/crags'}>
            내 암장 관리
          </MenuItem>

          <MenuItem
            icon={<Dashboard />}
            component={<Link to="dashboard" />}
            active={location.pathname === '/dashboard'}
          >
            대시보드
          </MenuItem>

          <Typography fontWeight="bold" sx={{ p: '0 20px', m: '32px 0 8px 0' }}>
            운영자 메뉴
          </Typography>

          <MenuItem
            icon={<SupervisorAccount />}
            component={<Link to="users" />}
            active={location.pathname === '/manage/users'}
          >
            사용자 관리
          </MenuItem>

          <MenuItem
            icon={<Foundation />}
            component={<Link to="new-crag" />}
            active={location.pathname === '/manage/new-crag'}
          >
            암장 추가
          </MenuItem>
        </Menu>
      </Sidebar>

      <Box sx={{ p: '1rem', flex: 1, overflowX: 'hidden', overflowY: 'scroll' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
          <IconButton onClick={() => setToggled(true)} sx={{ display: { lg: 'none' } }}>
            <MenuOpen sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
}
