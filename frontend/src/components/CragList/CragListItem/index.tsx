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
        alignItems: 'center',
        py: '12px',
        gap: 2,
        cursor: 'pointer',
      }}
      onClick={() => {
        map?.morph(new naver.maps.LatLng(crag.latitude, crag.longitude), 14);
        updateIsSearchOpen(false);
        setSelectCragId(crag.id);
      }}
    >
      <Avatar variant="rounded" src={crag.thumbnail_url ?? undefined} alt={crag.name} sx={{ width: 64, height: 64 }}>
        {!crag.thumbnail_url && crag.name.charAt(0)}
      </Avatar>

      <Box
        sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <Typography
          variant="h6"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {crag.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {distance !== null && `${distance.toFixed(1)}km · `}
          {crag.area ? `${crag?.area || '?'}평` : '-'}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography
            variant="body2"
            color={isOff ? theme.palette.text.secondary : theme.palette.success.main}
            fontWeight={isOff ? 'normal' : 'bold'}
          >
            {isOff ? '영업 종료' : '운영중'}
          </Typography>

          {remainSetupDay !== Infinity && (
            <Typography variant="body2">{`🍂 D-${remainSetupDay === 0 ? 'Day' : remainSetupDay}`}</Typography>
          )}

          {elapseSetupDay !== -1 && <Typography variant="body2">{`🔩 D+${elapseSetupDay}`}</Typography>}
        </Box>
      </Box>
    </Box>
  );
}
