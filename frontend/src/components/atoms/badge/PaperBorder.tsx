import { Badge, BadgeProps } from '@mui/material';

export function PaperBorder(props: BadgeProps) {
  return (
    <Badge
      {...props}
      sx={(theme) => ({
        '& .MuiBadge-badge': {
          right: 2,
          top: 4,
          border: `2px solid ${theme.palette.background.paper}`,
          padding: '0 4px',
        },
      })}
      color="info"
    />
  );
}
