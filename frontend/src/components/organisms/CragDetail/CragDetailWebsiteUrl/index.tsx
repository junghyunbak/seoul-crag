import { useContext } from 'react';

import { Divider, Box, IconButton } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import LaunchIcon from '@mui/icons-material/Launch';

import { CragDetailContext } from '../index.context';

export function CragDetailWebsiteUrl() {
  const { crag } = useContext(CragDetailContext);

  if (!crag) {
    return null;
  }

  const { website_url } = crag;

  if (!website_url) {
    return null;
  }

  return (
    <>
      <Divider />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <LanguageIcon
          sx={{
            fill: 'currentcolor',
          }}
        />

        <Box sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{website_url}</Box>

        <IconButton onClick={() => window.open(website_url, '_blank')}>
          <LaunchIcon />
        </IconButton>
      </Box>
    </>
  );
}
