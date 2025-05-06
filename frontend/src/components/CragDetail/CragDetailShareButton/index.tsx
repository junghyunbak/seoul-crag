import { useContext } from 'react';

import { IconButton } from '@mui/material';
import Share from '@mui/icons-material/Share';

import { CragDetailContext } from '@/components/CragDetail/index.context';

import { QUERY_STRING } from '@/constants';

export function CragDetailShareButton() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
  }

  return (
    <IconButton
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: '⛰️서울암장',
            text: [crag.name, '', crag.description].join('\n'),
            url: `/?${QUERY_STRING.SELECT_CRAG}=${crag.id}`,
          });
        }
      }}
    >
      <Share />
    </IconButton>
  );
}
