import { useState } from 'react';

import { Outlet, Link, useOutlet, useParams } from 'react-router';

import { Avatar, Box, Typography, TextField, useTheme } from '@mui/material';

import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

import { useFetchCrags } from '@/hooks';

import { useStore } from '@/store';
import { useShallow } from 'zustand/shallow';

import { Molecules } from '@/components/molecules';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/axios';
import { z } from 'zod';
import { feedSchema } from '@/schemas/feed';

export default function ManageCrags() {
  const { crags } = useFetchCrags({ feeds: true });
  const theme = useTheme();
  const outlet = useOutlet();
  const { id } = useParams<{ id?: string }>();

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

        <Menu
          menuItemStyles={{
            button: ({ active }) => {
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
                active={crag.id === id}
              >
                <Typography>
                  {`${crag.short_name || crag.name}`} <CragFeedCount crag={crag} />
                </Typography>
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

// [ ]: 컴포넌트 분리
function CragFeedCount({ crag }: { crag: Crag }) {
  const { data: feeds } = useQuery({
    queryKey: ['crag', 'feed', crag.id],
    queryFn: async () => {
      const { data } = await api.get(`/feeds/${crag.id}`);

      const feeds = z.array(feedSchema).parse(data);

      return feeds;
    },
    initialData: crag.feeds,
  });

  const feedCount = feeds?.filter((feed) => !feed.is_read)?.length || 0;

  if (!feedCount) {
    return null;
  }

  return <Typography component="span">{`(${feedCount})`}</Typography>;
}
