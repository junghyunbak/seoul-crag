import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Select,
  Typography,
  MenuItem,
  Divider,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';

import { useQueryParam, StringParam } from 'use-query-params';

import { QUERY_STRING } from '@/constants';
import { format, isAfter, isBefore } from 'date-fns';
import { useContext, useState } from 'react';
import { cragsContext } from '@/pages/manage/Crags/index.context';

const SORT_OPTIONS = ['최근 생성순', '마지막 수정순'] as const;

type SortOptions = (typeof SORT_OPTIONS)[number];

export function CragList() {
  const { crags } = useContext(cragsContext);

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const [sortOption, setSortOption] = useState<SortOptions>('최근 생성순');
  const [keyword, setKeyword] = useState('');

  const filteredCrags = crags.filter(
    (crag) => crag.name.toLowerCase().includes(keyword) || crag.short_name?.toLowerCase().includes(keyword)
  );

  const sortedCrags = (() => {
    return filteredCrags.sort((a, b) => {
      if (sortOption === '최근 생성순') {
        return isAfter(a.created_at, b.created_at) ? -1 : 1;
      }

      if (sortOption === '마지막 수정순') {
        return isBefore(a.updated_at, b.updated_at) ? -1 : 1;
      }

      return 0;
    });
  })();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={(theme) => ({ position: 'sticky', top: 0, background: theme.palette.common.white, zIndex: 1 })}>
        <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
          <Select value={sortOption} onChange={(e) => setSortOption(e.target.value as SortOptions)} label="정렬 옵션">
            {SORT_OPTIONS.map((opt, i) => {
              return (
                <MenuItem key={i} value={opt}>
                  {opt}
                </MenuItem>
              );
            })}
          </Select>

          <TextField label="검색" sx={{ flex: 1 }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        </Box>

        <Divider />
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container sx={{ width: '100%', height: '100%' }} spacing={4}>
          {sortedCrags.map((crag) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={crag.id}>
              <Card>
                <CardActionArea
                  sx={{ display: 'flex' }}
                  onClick={() => {
                    setSelectCragId(crag.id);
                  }}
                >
                  <CardMedia sx={{ p: 2 }}>
                    <Avatar sx={{ width: 100, height: 100 }} src={crag.thumbnail_url || ''}>
                      {crag.name[0]}
                    </Avatar>
                  </CardMedia>

                  <CardContent
                    sx={{
                      flex: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Typography variant="h5">{crag.name}</Typography>
                    <Typography variant="body2" sx={(theme) => ({ color: theme.palette.text.secondary })}>
                      {`최종 수정일: ${format(crag.updated_at, 'yyyy년 MM월 dd일')}`}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
