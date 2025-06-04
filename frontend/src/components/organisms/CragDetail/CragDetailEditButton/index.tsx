import { useContext } from 'react';

import { IconButton, Skeleton } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import { urlService } from '@/utils';

import { QUERY_STRING } from '@/constants';

import { CragDetailContext } from '../index.context';

export function CragDetailEditButton() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return <Skeleton variant="circular" width={37} height={37} />;
  }

  return (
    <IconButton
      onClick={() => {
        window.location.href = `${urlService.getAbsolutePath('/manage/crags')}?${QUERY_STRING.SELECT_CRAG}=${crag.id}`;
      }}
    >
      <Edit />
    </IconButton>
  );
}
