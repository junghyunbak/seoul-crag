import { IconButton, IconButtonProps } from '@mui/material';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

export function Back(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <ArrowBackIosNewIcon />
    </IconButton>
  );
}
