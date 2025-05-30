import { Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useQueryParam, BooleanParam } from 'use-query-params';
import { QUERY_STRING } from '@/constants';

export function MenuButton() {
  const [, setIsMenuOpen] = useQueryParam(QUERY_STRING.MENU, BooleanParam);

  return (
    <IconButton
      onClick={() => {
        setIsMenuOpen((prev) => !prev);
      }}
    >
      <MenuIcon />
    </IconButton>
  );
}
