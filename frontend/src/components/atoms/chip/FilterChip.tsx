import { Chip } from '@mui/material';

interface FilterProps {
  isActive: boolean;
  onClick: () => void;
  children: string;
}

export function Filter({ isActive, onClick, children }: FilterProps) {
  return (
    <Chip
      label={children}
      color={isActive ? 'primary' : 'default'}
      variant={isActive ? 'filled' : 'outlined'}
      onClick={onClick}
    />
  );
}
