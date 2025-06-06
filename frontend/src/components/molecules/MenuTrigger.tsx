import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface MenuTriggerProps {
  onClick?: () => void;
}

export function MenuTrigger({ onClick }: MenuTriggerProps) {
  return (
    <IconButton onClick={onClick}>
      <MenuIcon />
    </IconButton>
  );
}
