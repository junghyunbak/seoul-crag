import { useContext } from 'react';

import { IconButton, Skeleton } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import { urlService } from '@/utils';

import { CragDetailContext } from '../index.context';

export function CragDetailEditButton() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return <Skeleton variant="circular" width={37} height={37} />;
  }

  return (
    <IconButton
      onClick={() => {
        window.location.href = `${urlService.getAbsolutePath('/manage/crags')}/${crag.id}`;
      }}
    >
      <Edit />
    </IconButton>
  );
}
