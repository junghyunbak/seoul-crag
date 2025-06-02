import { Typography, TypographyProps } from '@mui/material';

export function Highlight(props: TypographyProps) {
  return <Typography {...props} component="span" sx={(theme) => ({ color: theme.palette.primary.main })} />;
}
