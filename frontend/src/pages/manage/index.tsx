import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router';

import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';

import { Box, IconButton, Typography } from '@mui/material';
import { Dashboard, Foundation, ManageAccounts, MenuOpen, SupervisorAccount, Terrain } from '@mui/icons-material';

import { urlService } from '@/utils';

type SidebarItem = {
  icon: React.ReactNode;
  pathname: string;
  title: string;
};

type SidebarList = { title: string; items: SidebarItem[] }[];

const sidebarList: SidebarList = [
  {
    title: '사용자 메뉴',
    items: [
      {
        icon: <ManageAccounts />,
        pathname: urlService.getAbsolutePath('/manage'),
        title: '내 정보 수정',
      },
    ],
  },
  {
    title: '관리자 메뉴',
    items: [
      {
        icon: <Terrain />,
        pathname: urlService.getAbsolutePath('/manage/crags'),
        title: '내 암장 관리',
      },
      {
        icon: <Dashboard />,
        pathname: urlService.getAbsolutePath('/manage/dashborad'),
        title: '대시보드',
      },
    ],
  },
  {
    title: '운영자 메뉴',
    items: [
      {
        icon: <SupervisorAccount />,
        pathname: urlService.getAbsolutePath('/manage/users'),
        title: '사용자 관리',
      },
      {
        icon: <Foundation />,
        pathname: urlService.getAbsolutePath('/manage/new-crag'),
        title: '암장 추가',
      },
    ],
  },
];

export function ManagePage() {
  const location = useLocation();

  const [toggled, setToggled] = useState(false);

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      {/**
       * xl === (mui)lg 1200px
       */}
      <Sidebar breakPoint="xl" toggled={toggled} onBackdropClick={() => setToggled(false)} backgroundColor="white">
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
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

          {sidebarList.map((sidebarItem, i) => {
            return (
              <Box key={i}>
                <Typography fontWeight="bold" sx={{ p: '0 20px', m: '32px 0 8px 0' }}>
                  {sidebarItem.title}
                </Typography>

                {sidebarItem.items.map(({ icon, title, pathname }) => {
                  return (
                    <MenuItem
                      key={pathname}
                      icon={icon}
                      component={<Link to={pathname} />}
                      active={location.pathname === pathname}
                    >
                      {title}
                    </MenuItem>
                  );
                })}
              </Box>
            );
          })}
        </Menu>
      </Sidebar>

      <Box sx={{ flex: 1, display: 'flex', overflowX: 'hidden', overflowY: 'scroll' }}>
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            zIndex: 10,

            m: 2,

            display: {
              lg: 'none',
            },
          }}
        >
          <IconButton onClick={() => setToggled(true)} sx={{ background: 'white', boxShadow: 2 }}>
            <MenuOpen sx={{ transform: 'rotate(180deg)' }} />
          </IconButton>
        </Box>

        <Outlet />
      </Box>
    </Box>
  );
}
