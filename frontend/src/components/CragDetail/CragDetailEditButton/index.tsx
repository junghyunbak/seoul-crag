import { useContext } from 'react';

import { CragDetailContext } from '@/components/CragDetail/index.context';

import { IconButton } from '@mui/material';
import Edit from '@mui/icons-material/Edit';

import { urlService } from '@/utils';

import { QUERY_STRING } from '@/constants';
import { useNavigate } from 'react-router';

export function CragDetailEditButton() {
  const navigate = useNavigate();
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
  }

  return (
    <IconButton
      onClick={() => {
        navigate(`${urlService.getAbsolutePath('/manage/crags')}?${QUERY_STRING.SELECT_CRAG}=${crag.id}`);
      }}
    >
      <Edit />
    </IconButton>
  );
}
