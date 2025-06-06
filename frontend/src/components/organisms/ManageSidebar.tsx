import { Link, useLocation } from 'react-router';

import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';

import { Box, Typography } from '@mui/material';
import SupervisorAccount from '@mui/icons-material/SupervisorAccount';
import Terrain from '@mui/icons-material/Terrain';
import TagIcon from '@mui/icons-material/Tag';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import Dashboard from '@mui/icons-material/Dashboard';
import Foundation from '@mui/icons-material/Foundation';
import ManageAccounts from '@mui/icons-material/ManageAccounts';

import { zIndex } from '@/styles';

import { urlService } from '@/utils';

type MenuGroupTitle = '사용자 메뉴' | '관리자 메뉴' | '운영자 메뉴';

type SidebarItem = {
  icon: React.ReactNode;
  pathname: string;
  title: string;
};

type SidebarList = { title: MenuGroupTitle; items: SidebarItem[] }[];

const sidebarList: SidebarList = [
  {
    title: '사용자 메뉴',
    items: [
      {
        icon: <ManageAccounts />,
        pathname: urlService.getAbsolutePath('/manage/user'),
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
      {
        icon: <Dashboard />,
        pathname: urlService.getAbsolutePath('/manage/dashborad'),
        title: '대시보드',
      },
      {
        icon: <TagIcon />,
        pathname: urlService.getAbsolutePath('/manage/tags'),
        title: '태그 관리',
      },
      {
        icon: <NotificationsNoneIcon />,
        pathname: urlService.getAbsolutePath('/manage/notices'),
        title: '공지 관리',
      },
      {
        icon: <VolunteerActivismIcon />,
        pathname: urlService.getAbsolutePath('/manage/contributions'),
        title: '기여 종목 관리',
      },
    ],
  },
];

interface ManageSidebarProps {
  isOpen: boolean;

  onClose: () => void;

  user: User | null;
}

export function ManageSidebar({ user, isOpen, onClose }: ManageSidebarProps) {
  const location = useLocation();

  if (!user) {
    return;
  }

  return (
    <Sidebar
      breakPoint="xl"
      toggled={isOpen}
      onBackdropClick={onClose}
      backgroundColor="white"
      style={{
        zIndex: zIndex.menu,
      }}
    >
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
        {sidebarList.map((sidebarItem, i) => {
          if (sidebarItem.title === '운영자 메뉴' && !user.userRoles.some(({ role }) => role.name === 'owner')) {
            return null;
          }

          if (
            sidebarItem.title === '관리자 메뉴' &&
            !user.userRoles.some(
              ({ role }) => role.name === 'gym_admin' || role.name === 'partner_admin' || role.name === 'owner'
            )
          ) {
            return null;
          }

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
                    active={location.pathname.startsWith(pathname)}
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
  );
}
