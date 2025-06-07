import { useState } from 'react';

import { Outlet, Link, useOutlet } from 'react-router';

import { Avatar, Box, Typography, TextField, useTheme } from '@mui/material';

import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { useFetchCrags } from '@/hooks';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { Molecules } from '@/components/molecules';

export default function ManageCrags() {
  const { crags } = useFetchCrags({ feeds: true });

  const theme = useTheme();

  const outlet = useOutlet();

  const [isCragsSidebarOpen, setIsCragsSidebarOpen] = useStore(
    useShallow((s) => [s.isCragsSidebarOpen, s.setIsCragsSidebarOpen])
  );

  const [keyword, setKeyword] = useState('');

  const filteredCrags = (crags || [])
    .filter((crag) => crag.name.toLowerCase().includes(keyword) || crag.short_name?.toLowerCase().includes(keyword))
    .map((crag) => ({
      ...crag,
      feeds: crag.feeds?.filter((feed) => !feed.is_read),
    }));

  const sortedCrags = filteredCrags.sort((a, b) => {
    return (a.feeds?.length || -Infinity) > (b.feeds?.length || -Infinity) ? -1 : 1;
  });

  return (
    <Box sx={{ display: 'flex', flex: 1 }}>
      <Sidebar
        breakPoint="lg"
        toggled={isCragsSidebarOpen}
        backgroundColor="white"
        onBackdropClick={() => {
          setIsCragsSidebarOpen(false);
        }}
        style={{
          zIndex: theme.zIndex.manageCragsSidebar,
        }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            label="검색"
            sx={{ flex: 1 }}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            fullWidth
          />
        </Box>

        <Menu>
          {sortedCrags.map((crag) => {
            return (
              <MenuItem
                key={crag.id}
                icon={
                  <Avatar src={crag.thumbnail_url || ''} sx={{ width: 30, height: 30 }}>
                    {crag.name[0]}
                  </Avatar>
                }
                component={<Link to={crag.id} />}
              >
                <Typography>{`${crag.short_name || crag.name} ${
                  crag.feeds?.length ? `(${crag.feeds.length})` : ''
                }`}</Typography>
              </MenuItem>
            );
          })}
        </Menu>
      </Sidebar>

      <Box sx={{ flex: 1, overflowY: 'scroll' }}>
        {outlet ? (
          <Outlet />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
            <Molecules.MenuTrigger
              onClick={() => {
                setIsCragsSidebarOpen(true);
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
