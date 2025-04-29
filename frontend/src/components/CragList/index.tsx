// 검색 정렬 조건 타입
export type SortType = 'distance' | 'newest' | 'size';

// 정렬 옵션 레이블 매핑
export const SORT_OPTIONS: Record<SortType, string> = {
  distance: '거리순',
  newest: '신규암장순',
  size: '암장 크기순',
};

// SearchBar Props 타입
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

// SortSelect Props 타입
export interface SortSelectProps {
  value: SortType;
  onChange: (value: SortType) => void;
}

// CragList Props 타입
export interface CragListProps {
  crags: Crag[];
  userLat?: number;
  userLng?: number;
}

// 거리 계산 함수 (Haversine Formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;

  const R = 6371; // 지구 반지름 km 단위
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 단위: km
}

// 검색어와 정렬 기준을 적용한 리스트를 반환하는 헬퍼 함수
export function getFilteredSortedCrags(
  crags: Crag[],
  search: string,
  sort: SortType,
  userLat?: number,
  userLng?: number
): Crag[] {
  const filtered = crags.filter((crag) => crag.name.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'distance' && userLat !== undefined && userLng !== undefined) {
      const distA = calculateDistance(userLat, userLng, a.latitude, a.longitude);
      const distB = calculateDistance(userLat, userLng, b.latitude, b.longitude);
      return distA - distB;
    }
    if (sort === 'newest') {
      const aDate = a.opened_at ? new Date(a.opened_at).getTime() : 0;
      const bDate = b.opened_at ? new Date(b.opened_at).getTime() : 0;
      return bDate - aDate;
    }
    if (sort === 'size') {
      return (b.area ?? 0) - (a.area ?? 0);
    }
    return 0;
  });

  return sorted;
}

// SearchBar 컴포넌트 예시
import { IconButton, MenuItem, Select, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
      <TextField
        fullWidth
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      {value && (
        <IconButton onClick={onClear} size="small" sx={{ ml: 1 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </div>
  );
}

// SortSelect 컴포넌트 예시
export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div style={{ padding: '8px' }}>
      <Select value={value} fullWidth onChange={(e) => onChange(e.target.value as SortType)}>
        {Object.entries(SORT_OPTIONS).map(([key, label]) => (
          <MenuItem key={key} value={key}>
            {label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

// CragListItem 컴포넌트 예시
import { Avatar } from '@mui/material';

export function CragListItem({ crag, userLat, userLng }: { crag: Crag; userLat?: number; userLng?: number }) {
  const { map } = useMap();
  const { updateIsCragListModalOpen } = useModifyCragList();

  const [, setSelectCragId] = useQueryParam(QUERY_STRING.SELECT_CRAG, StringParam);

  const distance =
    userLat !== undefined && userLng !== undefined
      ? calculateDistance(userLat, userLng, crag.latitude, crag.longitude)
      : null;

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #eee', gap: 12 }}
      onClick={() => {
        map?.panTo(new naver.maps.LatLng(crag.latitude, crag.longitude));
        updateIsCragListModalOpen(false);
        setSelectCragId(crag.id);
      }}
    >
      <Avatar variant="rounded" src={crag.thumbnail_url ?? undefined} alt={crag.name} sx={{ width: 64, height: 64 }}>
        {!crag.thumbnail_url && crag.name.charAt(0)}
      </Avatar>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div
          style={{
            fontWeight: 'bold',
            fontSize: 16,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {crag.name}
        </div>
        <div style={{ fontSize: 12, color: '#666' }}>
          {distance !== null && `${distance.toFixed(1)}km · `}
          {crag.area ? `${crag.area}평` : ''}
        </div>
      </div>
    </div>
  );
}

// CragList 컴포넌트 예시
export function CragList({ crags, userLat, userLng }: CragListProps) {
  return (
    <div>
      {crags.map((crag) => (
        <CragListItem key={crag.id} crag={crag} userLat={userLat} userLng={userLng} />
      ))}
    </div>
  );
}

// CragListModal 컴포넌트 (MUI Modal 버전) - 내부에서 위치 상태 관리
import { Modal, Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useMap, useModifyCragList } from '@/hooks';
import { QUERY_STRING } from '@/constants';
import { StringParam, useQueryParam } from 'use-query-params';

export function CragListModal({ crags, open, onClose }: { crags: Crag[]; open: boolean; onClose: () => void }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('distance');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (open) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('위치 정보를 가져오는 데 실패했습니다.', error);
        }
      );
    }
  }, [open]);

  const filteredCrags = getFilteredSortedCrags(crags, search, sort, userLocation?.lat, userLocation?.lng);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: 600,
          height: 'calc(100% - 32px)',
          marginTop: 2,
          marginBottom: 2,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <Typography variant="h6">암장 찾기</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <SearchBar value={search} onChange={setSearch} onClear={() => setSearch('')} />
        <SortSelect value={sort} onChange={setSort} />

        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, pb: 2 }}>
          <CragList crags={filteredCrags} userLat={userLocation?.lat} userLng={userLocation?.lng} />
        </Box>
      </Box>
    </Modal>
  );
}
