import { useContext } from 'react';

import { CragDetailContext } from '@/components/CragDetail/index.context';

import { IconButton } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import { urlService } from '@/utils';

import { QUERY_STRING } from '@/constants';

export function CragDetailEditButton() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
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
