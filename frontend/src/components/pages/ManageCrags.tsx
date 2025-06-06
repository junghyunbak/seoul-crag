import { useState } from 'react';

import { Outlet, Link } from 'react-router';

import { Avatar, Box, Typography, TextField } from '@mui/material';

import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { useFetchCrags } from '@/hooks';

export default function ManageCrags() {
  const { crags } = useFetchCrags({ feeds: true });

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
    <Box sx={{ display: 'flex' }}>
      <Sidebar breakPoint="lg">
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
                <Typography>{`${crag.short_name} ${crag.feeds?.length ? `(${crag.feeds.length})` : ''}`}</Typography>
              </MenuItem>
            );
          })}
        </Menu>
      </Sidebar>

      <Box sx={{ flex: 1, overflowY: 'scroll' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
