import { Avatar, Box, Typography, useTheme } from '@mui/material';

import { useQueryParam, StringParam } from 'use-query-params';

import { calculateDistance } from '@/utils';

import { QUERY_STRING } from '@/constants';

import { useExp, useFilter, useMap, useModifySearch } from '@/hooks';

interface CragListItemProps {
  crag: Crag;
}

export function CragListItem({ crag }: CragListItemProps) {
  const { exp } = useExp();
  const { isOff, remainSetupDay, elapseSetupDay } = useFilter(crag, exp.date);
  const { map, gpsLatLng } = useMap();
  const theme = useTheme();

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const { updateIsSearchOpen } = useModifySearch();

  const distance =
    gpsLatLng.lat !== -1 && gpsLatLng.lng !== -1
      ? calculateDistance(gpsLatLng.lat, gpsLatLng.lng, crag.latitude, crag.longitude)
      : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        py: '12px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          cursor: 'pointer',
        }}
        onClick={() => {
          updateIsSearchOpen(false);

          if (map) {
            new Promise((resolve) => {
              map.morph(map.getCenter(), 11, { duration: 1000 });

              setTimeout(() => {
                resolve(true);
              }, 1000);
            }).then(() => {
              map.morph(new naver.maps.LatLng(crag.latitude, crag.longitude), 13, { duration: 1750 });
              setSelectCragId(crag.id);
            });
          }
        }}
      >
        <Avatar variant="circular" src={crag.thumbnail_url ?? undefined} alt={crag.name} sx={{ width: 64, height: 64 }}>
          {!crag.thumbnail_url && crag.name.charAt(0)}
        </Avatar>

        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {crag.name}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {distance !== null && `${distance.toFixed(1)}km · `}
            {crag.area ? `${crag?.area || '?'}평` : '-'}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '& > div': {
            width: '33%',
            display: 'flex',
            justifyContent: 'center',
          },
        }}
      >
        <Box>
          <Typography
            variant="body1"
            color={isOff ? theme.palette.text.secondary : theme.palette.success.main}
            fontWeight={isOff ? 'normal' : 'bold'}
          >
            {isOff ? '영업 종료' : '영업중'}
          </Typography>
        </Box>

        <Box>
          {remainSetupDay !== Infinity && (
            <Typography variant="body1">{`🍂 ${
              remainSetupDay === 0 ? '오늘 탈거' : `D-${remainSetupDay}`
            }`}</Typography>
          )}
        </Box>

        <Box>
          {elapseSetupDay !== Infinity && (
            <Typography variant="body1">{`🔩 ${
              elapseSetupDay === 0 ? '오늘 세팅' : `D+${elapseSetupDay}`
            }`}</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
