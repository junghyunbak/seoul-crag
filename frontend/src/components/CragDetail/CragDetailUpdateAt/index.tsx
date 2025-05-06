import { CragDetailContext } from '@/components/CragDetail/index.context';
import { Typography } from '@mui/material';

import { format } from 'date-fns';
import { useContext } from 'react';

export function CragDetailUpdateAt() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
  }

  return (
    <Typography variant="caption" color="text.secondary">
      {`최근 정보 갱신일 · ${format(new Date(crag.updated_at), 'yyyy년 MM월 dd일')}`}
    </Typography>
  );
}
