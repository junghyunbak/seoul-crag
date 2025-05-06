import { Avatar, Box } from '@mui/material';
import { useQueryParam, StringParam } from 'use-query-params';
import { useMap } from '@/hooks/useMap';
import { useModifySearch } from '@/hooks/useModifySearch';
import { calculateDistance } from '@/utils';
import { QUERY_STRING } from '@/constants';

interface CragListItemProps {
  crag: Crag;
}

export function CragListItem({ crag }: CragListItemProps) {
  const { map, gpsLatLng } = useMap();
  const { updateIsSearchOpen } = useModifySearch();

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

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
        borderBottom: '1px solid #eee',
        gap: 2,
        cursor: 'pointer',
      }}
      onClick={() => {
        map?.panTo(new naver.maps.LatLng(crag.latitude, crag.longitude));
        updateIsSearchOpen(false);
        setSelectCragId(crag.id);
      }}
    >
      <Avatar variant="rounded" src={crag.thumbnail_url ?? undefined} alt={crag.name} sx={{ width: 64, height: 64 }}>
        {!crag.thumbnail_url && crag.name.charAt(0)}
      </Avatar>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box
          sx={{
            fontWeight: 'bold',
            fontSize: 16,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {crag.name}
        </Box>
        <div style={{ fontSize: 12, color: '#666' }}>
          {distance !== null && `${distance.toFixed(1)}km · `}
          {crag.area ? `${crag?.area || '?'}평` : '-'}
        </div>
      </Box>
    </Box>
  );
}
