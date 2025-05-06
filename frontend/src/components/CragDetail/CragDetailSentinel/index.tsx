import { Box } from '@mui/material';

import { forwardRef } from 'react';

export const CragDetailSentinel = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <Box
      ref={ref}
      sx={{
        height: '1px',
      }}
    />
  );
});
